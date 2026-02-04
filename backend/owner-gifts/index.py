import json
import os
import psycopg2
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    '''API для получения и активации подарков владельцами'''
    
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
            # Получить подарки для владельца
            owner_id = event.get('queryStringParameters', {}).get('owner_id')
            
            if not owner_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'owner_id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                SELECT 
                    g.id, g.gift_type, g.gift_value, g.status, 
                    g.created_at, g.activated_at, g.description,
                    g.listing_id,
                    l.title as listing_name
                FROM gifts g
                LEFT JOIN listings l ON g.listing_id = l.id
                WHERE g.owner_id = %s AND g.status = 'pending'
                ORDER BY g.created_at DESC
            ''', (owner_id,))
            
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
                    'listing_id': row[7],
                    'listing_name': row[8]
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
            # Активировать подарок
            body_str = event.get('body', '{}')
            if not body_str or body_str.strip() == '':
                body_str = '{}'
            body = json.loads(body_str)
            
            gift_id = body.get('gift_id')
            
            if not gift_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'gift_id is required'}),
                    'isBase64Encoded': False
                }
            
            # Получаем информацию о подарке
            cur.execute('''
                SELECT gift_type, gift_value, listing_id, status
                FROM gifts
                WHERE id = %s
            ''', (gift_id,))
            
            row = cur.fetchone()
            
            if not row:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Подарок не найден'}),
                    'isBase64Encoded': False
                }
            
            gift_type, gift_value, listing_id, status = row
            
            if status != 'pending':
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Подарок уже активирован или истёк'}),
                    'isBase64Encoded': False
                }
            
            now = datetime.utcnow()
            
            # Применяем подарок в зависимости от типа
            if gift_type == 'subscription':
                # Получаем текущую дату окончания подписки
                cur.execute('''
                    SELECT subscription_expires_at
                    FROM listings
                    WHERE id = %s
                ''', (listing_id,))
                
                current_expires = cur.fetchone()[0]
                
                # Если подписка ещё активна, добавляем дни к ней, иначе от текущей даты
                if current_expires and current_expires > now:
                    new_expires = current_expires + timedelta(days=gift_value)
                else:
                    new_expires = now + timedelta(days=gift_value)
                
                # Обновляем подписку
                cur.execute('''
                    UPDATE listings
                    SET subscription_expires_at = %s, status = 'active', updated_at = %s
                    WHERE id = %s
                ''', (new_expires, now, listing_id))
            
            # Отмечаем подарок как активированный
            cur.execute('''
                UPDATE gifts
                SET status = 'activated', activated_at = %s
                WHERE id = %s
            ''', (now, gift_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': f'Подарок успешно активирован! Подписка продлена на {gift_value} дн.'
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
