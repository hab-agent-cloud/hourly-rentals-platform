import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для управления акциями владельцев (создание, получение, удаление)'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization'
            },
            'body': ''
        }
    
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT id FROM t_p39732784_hourly_rentals_platf.owners 
            WHERE token = %s
        """, (token,))
        owner_row = cur.fetchone()
        
        if not owner_row:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный токен'})
            }
        
        owner_id = owner_row[0]
        
        if method == 'GET':
            listing_id = event.get('queryStringParameters', {}).get('listing_id')
            
            if listing_id:
                cur.execute("""
                    SELECT id, promotion_type, discount_percent, expires_at, is_active, created_at
                    FROM t_p39732784_hourly_rentals_platf.promotions
                    WHERE listing_id = %s AND owner_id = %s AND is_active = true
                    ORDER BY created_at DESC
                """, (listing_id, owner_id))
            else:
                cur.execute("""
                    SELECT id, listing_id, promotion_type, discount_percent, expires_at, is_active, created_at
                    FROM t_p39732784_hourly_rentals_platf.promotions
                    WHERE owner_id = %s AND is_active = true
                    ORDER BY created_at DESC
                """, (owner_id,))
            
            promotions = []
            for row in cur.fetchall():
                if listing_id:
                    promo_id, promo_type, discount, expires, active, created = row
                    promo_listing_id = int(listing_id)
                else:
                    promo_id, promo_listing_id, promo_type, discount, expires, active, created = row
                
                promotions.append({
                    'id': promo_id,
                    'listing_id': promo_listing_id,
                    'promotion_type': promo_type,
                    'discount_percent': discount,
                    'expires_at': expires.isoformat() if expires else None,
                    'is_active': active,
                    'created_at': created.isoformat() if created else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'promotions': promotions})
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            listing_id = body.get('listing_id')
            promotion_type = body.get('promotion_type')
            discount_percent = body.get('discount_percent')
            expires_at = body.get('expires_at')
            
            if not all([listing_id, promotion_type, expires_at]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Необходимы listing_id, promotion_type и expires_at'})
                }
            
            if promotion_type not in ['hot_offer', 'three_for_two']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный тип акции'})
                }
            
            if promotion_type == 'hot_offer':
                if not discount_percent or discount_percent < 10:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Скидка должна быть минимум 10%'})
                    }
            
            cur.execute("""
                SELECT owner_id FROM t_p39732784_hourly_rentals_platf.listings
                WHERE id = %s
            """, (listing_id,))
            listing_row = cur.fetchone()
            
            if not listing_row or listing_row[0] != owner_id:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Объект не найден или не принадлежит вам'})
                }
            
            cur.execute("""
                SELECT subscription_expires_at FROM t_p39732784_hourly_rentals_platf.listings
                WHERE id = %s
            """, (listing_id,))
            sub_row = cur.fetchone()
            
            if not sub_row or not sub_row[0] or sub_row[0] < datetime.now():
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Сначала продлите подписку'})
                }
            
            subscription_expires = sub_row[0]
            promotion_expires = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
            
            if promotion_expires > subscription_expires:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Акция не может действовать дольше подписки'})
                }
            
            cur.execute("""
                INSERT INTO t_p39732784_hourly_rentals_platf.promotions
                (listing_id, owner_id, promotion_type, discount_percent, expires_at, is_active)
                VALUES (%s, %s, %s, %s, %s, true)
                RETURNING id
            """, (listing_id, owner_id, promotion_type, discount_percent, expires_at))
            
            promo_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': promo_id, 'message': 'Акция создана'})
            }
        
        elif method == 'DELETE':
            promo_id = event.get('queryStringParameters', {}).get('id')
            
            if not promo_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Необходим id акции'})
                }
            
            cur.execute("""
                UPDATE t_p39732784_hourly_rentals_platf.promotions
                SET is_active = false
                WHERE id = %s AND owner_id = %s
            """, (promo_id, owner_id))
            
            if cur.rowcount == 0:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Акция не найдена'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Акция удалена'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    finally:
        cur.close()
        conn.close()
