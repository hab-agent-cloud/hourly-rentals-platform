import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta, timezone
import random

PACKAGE_PRICES = {
    'bronze': 3000,
    'silver': 5000,
    'gold': 7000
}

PACKAGE_RANGES = {
    'bronze': (20, 50),
    'silver': (10, 40),
    'gold': (1, 30)
}

def get_daily_position(package_type: str, start_date: datetime) -> int:
    '''Вычисляет позицию на основе типа пакета и даты начала'''
    min_pos, max_pos = PACKAGE_RANGES[package_type]
    
    days_since_start = (datetime.now(timezone.utc).date() - start_date.date()).days
    random.seed(f"{package_type}-{days_since_start}")
    
    return random.randint(min_pos, max_pos)

def handler(event: dict, context) -> dict:
    '''API для управления пакетами продвижения с фиксированными ценами'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            city = event.get('queryStringParameters', {}).get('city', '')
            owner_id = event.get('queryStringParameters', {}).get('owner_id')
            
            if not city:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'City parameter required'}),
                    'isBase64Encoded': False
                }
            
            requesting_owner_id = int(owner_id) if owner_id else None
            
            cur.execute("""
                SELECT 
                    pp.id,
                    pp.listing_id,
                    l.title as listing_title,
                    pp.owner_id,
                    pp.package_type,
                    pp.price_paid,
                    pp.start_date,
                    pp.end_date,
                    pp.is_active
                FROM t_p39732784_hourly_rentals_platf.promotion_packages pp
                JOIN t_p39732784_hourly_rentals_platf.listings l ON l.id = pp.listing_id
                WHERE pp.city = %s 
                  AND pp.is_active = true
                  AND pp.end_date > CURRENT_TIMESTAMP
                ORDER BY pp.package_type DESC, pp.start_date ASC
            """, (city,))
            
            active_packages = []
            for row in cur.fetchall():
                is_owner = requesting_owner_id and row['owner_id'] == requesting_owner_id
                
                package_data = {
                    'id': row['id'],
                    'listing_id': row['listing_id'] if is_owner else None,
                    'listing_title': row['listing_title'] if is_owner else None,
                    'owner_id': row['owner_id'] if is_owner else None,
                    'package_type': row['package_type'],
                    'price_paid': row['price_paid'],
                    'start_date': row['start_date'].isoformat() if is_owner else None,
                    'end_date': row['end_date'].isoformat() if is_owner else None,
                    'current_position': get_daily_position(row['package_type'], row['start_date'])
                }
                
                active_packages.append(package_data)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'packages': active_packages,
                    'pricing': {
                        'bronze': {'price': 3000, 'range': '20-50 место', 'description': 'Ваше объявление каждый день будет на одном из мест с 20 по 50'},
                        'silver': {'price': 5000, 'range': '10-40 место', 'description': 'Ваше объявление каждый день будет на одном из мест с 10 по 40'},
                        'gold': {'price': 7000, 'range': '1-30 место', 'description': 'Ваше объявление каждый день будет на одном из мест с 1 по 30'}
                    },
                    'city': city
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            owner_id = body.get('owner_id')
            
            if not owner_id:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'}),
                    'isBase64Encoded': False
                }
            
            if action == 'purchase_package':
                listing_id = body.get('listing_id')
                city = body.get('city')
                package_type = body.get('package_type')
                
                if not listing_id or not city or not package_type:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'}),
                        'isBase64Encoded': False
                    }
                
                if package_type not in PACKAGE_PRICES:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid package type'}),
                        'isBase64Encoded': False
                    }
                
                price = PACKAGE_PRICES[package_type]
                
                cur.execute("SELECT owner_id FROM t_p39732784_hourly_rentals_platf.listings WHERE id = %s", (listing_id,))
                listing_owner = cur.fetchone()
                if not listing_owner or listing_owner['owner_id'] != owner_id:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Not your listing'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT balance, bonus_balance FROM t_p39732784_hourly_rentals_platf.owners WHERE id = %s", (owner_id,))
                owner = cur.fetchone()
                total_balance = owner['balance'] + owner['bonus_balance']
                
                if total_balance < price:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'Insufficient balance. Need {price} ₽'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("""
                    SELECT id FROM t_p39732784_hourly_rentals_platf.promotion_packages
                    WHERE listing_id = %s 
                      AND city = %s
                      AND is_active = true
                      AND end_date > CURRENT_TIMESTAMP
                """, (listing_id, city))
                
                existing_package = cur.fetchone()
                if existing_package:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'У этого объекта уже есть активный пакет'}),
                        'isBase64Encoded': False
                    }
                
                bonus_used = min(owner['bonus_balance'], price)
                balance_used = price - bonus_used
                
                cur.execute("""
                    UPDATE t_p39732784_hourly_rentals_platf.owners 
                    SET balance = balance - %s, bonus_balance = bonus_balance - %s
                    WHERE id = %s
                """, (balance_used, bonus_used, owner_id))
                
                start_date = datetime.now(timezone.utc)
                end_date = start_date + timedelta(days=30)
                
                cur.execute("""
                    INSERT INTO t_p39732784_hourly_rentals_platf.promotion_packages 
                    (listing_id, owner_id, city, package_type, price_paid, start_date, end_date, is_active)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, true)
                    RETURNING id
                """, (listing_id, owner_id, city, package_type, price, start_date, end_date))
                
                package_id = cur.fetchone()['id']
                
                package_names = {'bronze': 'Бронза', 'silver': 'Серебро', 'gold': 'Золото'}
                
                cur.execute("""
                    INSERT INTO t_p39732784_hourly_rentals_platf.transactions 
                    (owner_id, amount, type, description, balance_after)
                    VALUES (%s, %s, 'promotion_purchase', %s, 
                            (SELECT balance + bonus_balance FROM t_p39732784_hourly_rentals_platf.owners WHERE id = %s))
                """, (owner_id, -price, f'Пакет {package_names[package_type]} для города {city}', owner_id))
                
                daily_position = get_daily_position(package_type, start_date)
                
                cur.execute("""
                    UPDATE t_p39732784_hourly_rentals_platf.listings 
                    SET auction = %s 
                    WHERE id = %s
                """, (daily_position, listing_id))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': f'Пакет {package_names[package_type]} успешно активирован! Сегодня ваша позиция: {daily_position}',
                        'package_id': package_id,
                        'current_position': daily_position
                    }),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unknown action'}),
                    'isBase64Encoded': False
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        print(f'ERROR: {type(e).__name__}: {str(e)}')
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
