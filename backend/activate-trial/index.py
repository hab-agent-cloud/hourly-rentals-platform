import json
import os
import psycopg2
import requests
from datetime import datetime, timedelta

def send_telegram_notification(owner_name: str, listing_title: str, new_expiry: str) -> None:
    '''Отправляет уведомление администратору в Telegram'''
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_ADMIN_CHAT_ID')
    
    if not bot_token or not chat_id:
        return
    
    message = f"🎉 <b>Активирована пробная подписка!</b>\n\n"
    message += f"👤 Владелец: {owner_name}\n"
    message += f"🏨 Объект: {listing_title}\n"
    message += f"📅 Подписка до: {new_expiry}\n\n"
    message += f"Владелец получил 14 дней бесплатной подписки."
    
    try:
        requests.post(
            f'https://api.telegram.org/bot{bot_token}/sendMessage',
            json={
                'chat_id': chat_id,
                'text': message,
                'parse_mode': 'HTML'
            },
            timeout=5
        )
    except Exception as e:
        print(f'Telegram notification error: {e}')

def handler(event: dict, context) -> dict:
    '''API для активации бесплатной пробной подписки на 14 дней (одноразовая акция для владельца)'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        body_str = event.get('body', '{}')
        if not body_str or body_str.strip() == '':
            body_str = '{}'
        body = json.loads(body_str)
        owner_id = body.get('owner_id')
        listing_id = body.get('listing_id')
        
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
        
        schema = 't_p39732784_hourly_rentals_platf'
        
        # Проверяем, не активировал ли владелец уже пробную подписку
        cur.execute(f'''
            SELECT trial_activated FROM {schema}.owners WHERE id = %s
        ''', (owner_id,))
        result = cur.fetchone()
        
        if not result:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Owner not found'}),
                'isBase64Encoded': False
            }
        
        if result[0]:  # trial_activated = True
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'trial_already_activated',
                    'message': 'Вы уже активировали пробную подписку ранее'
                }),
                'isBase64Encoded': False
            }
        
        # Получаем информацию о владельце
        cur.execute(f'''
            SELECT full_name FROM {schema}.owners WHERE id = %s
        ''', (owner_id,))
        owner_data = cur.fetchone()
        owner_name = owner_data[0] if owner_data else 'Неизвестный'
        
        # Если указан listing_id, продлеваем подписку для конкретного объекта
        if listing_id:
            cur.execute(f'''
                SELECT subscription_expires_at, title FROM {schema}.listings 
                WHERE id = %s AND owner_id = %s
            ''', (listing_id, owner_id))
            listing = cur.fetchone()
            
            if not listing:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Listing not found or not owned by this owner'}),
                    'isBase64Encoded': False
                }
            
            current_expiry = listing[0]
            listing_title = listing[1]
            now = datetime.now()
            if current_expiry and current_expiry > now:
                new_expiry = current_expiry + timedelta(days=14)
            else:
                new_expiry = now + timedelta(days=14)
            
            cur.execute(f'''
                UPDATE {schema}.listings 
                SET subscription_expires_at = %s
                WHERE id = %s
            ''', (new_expiry, listing_id))
            
            message = f'Подписка для объекта продлена на 14 дней до {new_expiry.strftime("%d.%m.%Y")}'
        else:
            # Если listing_id не указан, продлеваем подписку для первого активного объекта
            cur.execute(f'''
                SELECT id, subscription_expires_at, title FROM {schema}.listings 
                WHERE owner_id = %s AND is_archived = false
                ORDER BY id ASC
                LIMIT 1
            ''', (owner_id,))
            listing = cur.fetchone()
            
            if not listing:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'No active listings found'}),
                    'isBase64Encoded': False
                }
            
            listing_id = listing[0]
            current_expiry = listing[1]
            listing_title = listing[2]
            now = datetime.now()
            
            if current_expiry and current_expiry > now:
                new_expiry = current_expiry + timedelta(days=14)
            else:
                new_expiry = now + timedelta(days=14)
            
            cur.execute(f'''
                UPDATE {schema}.listings 
                SET subscription_expires_at = %s
                WHERE id = %s
            ''', (new_expiry, listing_id))
            
            message = f'Пробная подписка активирована на 14 дней до {new_expiry.strftime("%d.%m.%Y")}'
        
        # Отмечаем, что владелец активировал пробную подписку
        cur.execute(f'''
            UPDATE {schema}.owners 
            SET trial_activated = true
            WHERE id = %s
        ''', (owner_id,))
        
        conn.commit()
        
        # Отправляем уведомление администратору
        send_telegram_notification(
            owner_name=owner_name,
            listing_title=listing_title,
            new_expiry=new_expiry.strftime('%d.%m.%Y')
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': message,
                'listing_id': listing_id,
                'new_expiry': new_expiry.isoformat()
            }),
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