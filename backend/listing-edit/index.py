import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для редактирования объектов менеджерами'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters', {})
            listing_id = query_params.get('id') if query_params else None
            
            print(f"[DEBUG] Query params: {query_params}, listing_id: {listing_id}, schema: {schema}")
            
            if not listing_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'listing_id is required'}),
                    'isBase64Encoded': False
                }
            
            print(f"[DEBUG] Executing query for listing_id: {listing_id}")
            
            cur.execute(f'''
                SELECT 
                    l.id, l.title, l.description, l.address, l.district, l.metro,
                    l.phone, l.telegram, l.type, l.price, l.status, 
                    l.subscription_expires_at, l.created_by_employee_id, 
                    l.owner_id, l.square_meters, l.parking_type, 
                    l.parking_price_per_hour, l.short_title, l.trial_activated_at,
                    o.full_name as owner_name, l.image_url, l.logo_url,
                    l.gold_gift_sent_at
                FROM {schema}.listings l
                LEFT JOIN {schema}.owners o ON l.owner_id = o.id
                WHERE l.id = %s
            ''', (listing_id,))
            
            row = cur.fetchone()
            print(f"[DEBUG] Query result: {row}")
            
            if not row:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Listing not found'}),
                    'isBase64Encoded': False
                }
            
            # Получаем комнаты для объекта
            cur.execute(f'''
                SELECT id, type, price, description, image_url, square_meters, features, min_hours
                FROM {schema}.rooms
                WHERE listing_id = %s
                ORDER BY id
            ''', (listing_id,))
            
            rooms_rows = cur.fetchall()
            rooms = []
            for room_row in rooms_rows:
                rooms.append({
                    'id': room_row[0],
                    'type': room_row[1],
                    'price': room_row[2],
                    'description': room_row[3],
                    'image_url': room_row[4],
                    'square_meters': room_row[5],
                    'features': room_row[6] if room_row[6] else [],
                    'min_hours': room_row[7]
                })
            
            listing = {
                'id': row[0],
                'name': row[1],
                'description': row[2],
                'address': row[3],
                'district': row[4],
                'metro_station': row[5],
                'contact_phone': row[6],
                'contact_telegram': row[7],
                'type': row[8],
                'price_per_day': float(row[9]) if row[9] else None,
                'status': row[10],
                'subscription_end': row[11].isoformat() if row[11] else None,
                'assigned_manager_id': row[12],
                'owner_id': row[13],
                'square_meters': row[14],
                'parking_type': row[15],
                'parking_price_per_hour': row[16],
                'short_title': row[17],
                'trial_activated_at': row[18].isoformat() if row[18] else None,
                'owner_name': row[19],
                'image_url': row[20],
                'logo_url': row[21],
                'rooms': rooms,
                'gold_gift_sent_at': row[22].isoformat() if row[22] else None
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'listing': listing}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            listing_id = body.get('listing_id')
            if not listing_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'listing_id is required'}),
                    'isBase64Encoded': False
                }
            
            updates = []
            params = []
            
            field_mapping = {
                'name': 'title',
                'description': 'description',
                'address': 'address',
                'district': 'district',
                'metro_station': 'metro',
                'contact_phone': 'phone',
                'contact_telegram': 'telegram',
                'type': 'type',
                'price_per_day': 'price',
                'square_meters': 'square_meters',
                'parking_type': 'parking_type',
                'parking_price_per_hour': 'parking_price_per_hour',
                'short_title': 'short_title',
                'image_url': 'image_url',
                'logo_url': 'logo_url'
            }
            
            for frontend_field, db_field in field_mapping.items():
                if frontend_field in body:
                    updates.append(f"{db_field} = %s")
                    params.append(body[frontend_field])
            
            if not updates:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
            
            updates.append("updated_at = NOW()")
            params.append(listing_id)
            
            query = f'''
                UPDATE {schema}.listings
                SET {', '.join(updates)}
                WHERE id = %s
            '''
            
            cur.execute(query, params)
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'Объект успешно обновлен'
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"[ERROR] Exception occurred: {str(e)}")
        print(f"[ERROR] Traceback: {error_details}")
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e), 'details': error_details}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()