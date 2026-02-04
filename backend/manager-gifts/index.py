import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для управления подарками менеджеров владельцам'''
    
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
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            # Получить подарки для конкретного листинга
            listing_id = event.get('queryStringParameters', {}).get('listing_id')
            
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
            
            cur.execute('''
                SELECT 
                    g.id, g.gift_type, g.gift_value, g.status, 
                    g.created_at, g.activated_at, g.description,
                    e.name as manager_name
                FROM gifts g
                LEFT JOIN employees e ON g.created_by_manager_id = e.id
                WHERE g.listing_id = %s
                ORDER BY g.created_at DESC
            ''', (listing_id,))
            
            rows = cur.fetchall()
            gifts = []
            for row in rows:
                gifts.append({
                    'id': row[0],
                    'gift_type': row[1],
                    'gift_value': row[2],
                    'status': row[3],
                    'created_at': row[4].isoformat() if row[4] else None,
                    'activated_at': row[5].isoformat() if row[5] else None,
                    'description': row[6],
                    'manager_name': row[7]
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'gifts': gifts}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_str = event.get('body', '{}')
            if not body_str or body_str.strip() == '':
                body_str = '{}'
            body = json.loads(body_str)
            
            listing_id = body.get('listing_id')
            gift_type = body.get('gift_type', 'subscription')
            gift_value = body.get('gift_value')
            manager_id = body.get('manager_id')
            
            if not listing_id or not gift_value:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'listing_id and gift_value are required'}),
                    'isBase64Encoded': False
                }
            
            # Проверяем диапазон дней для подписки
            if gift_type == 'subscription':
                if not (1 <= gift_value <= 14):
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Подписка может быть от 1 до 14 дней'}),
                        'isBase64Encoded': False
                    }
            
            # Получаем owner_id из листинга
            cur.execute('SELECT owner_id FROM listings WHERE id = %s', (listing_id,))
            row = cur.fetchone()
            
            if not row:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Объект не найден'}),
                    'isBase64Encoded': False
                }
            
            owner_id = row[0]
            
            # Создаём подарок
            description = f"Подписка на {gift_value} дн." if gift_type == 'subscription' else ''
            
            cur.execute('''
                INSERT INTO gifts (listing_id, owner_id, created_by_manager_id, gift_type, gift_value, description)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (listing_id, owner_id, manager_id, gift_type, gift_value, description))
            
            gift_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'gift_id': gift_id,
                    'message': f'Подарок успешно создан: {description}'
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
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
