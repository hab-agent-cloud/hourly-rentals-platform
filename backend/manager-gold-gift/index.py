import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    '''API для отправки подарка "Пакет Золото на 14 дней" владельцу'''
    
    method = event.get('httpMethod', 'POST')
    
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
    
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body_str = event.get('body', '{}')
            if not body_str or body_str.strip() == '':
                body_str = '{}'
            body = json.loads(body_str)
            listing_id = body.get('listing_id')
            
            if not listing_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'listing_id обязателен'}),
                    'isBase64Encoded': False
                }
            
            # Получаем информацию об объекте
            cur.execute(f'''
                SELECT 
                    l.id, l.owner_id, l.subscription_expires_at, l.title,
                    l.gold_gift_sent_at
                FROM {schema}.listings l
                WHERE l.id = %s
            ''', (listing_id,))
            
            listing = cur.fetchone()
            
            if not listing:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Объект не найден'}),
                    'isBase64Encoded': False
                }
            
            if not listing['owner_id']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'У объекта нет владельца'}),
                    'isBase64Encoded': False
                }
            
            # Проверяем, что подарок еще не отправлялся
            if listing['gold_gift_sent_at']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Подарок уже был отправлен этому владельцу'}),
                    'isBase64Encoded': False
                }
            
            # Проверяем, что подписка оплачена минимум на 1 месяц
            if not listing['subscription_expires_at']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'У владельца нет оплаченной подписки'}),
                    'isBase64Encoded': False
                }
            
            subscription_end = listing['subscription_expires_at']
            now = datetime.now()
            
            # Проверяем что подписка длится минимум 30 дней от текущей даты
            if isinstance(subscription_end, str):
                subscription_end = datetime.fromisoformat(subscription_end.replace('Z', '+00:00'))
            
            days_remaining = (subscription_end - now).days
            
            if days_remaining < 30:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'error': 'Подписка должна быть оплачена минимум на 1 месяц вперед',
                        'days_remaining': days_remaining
                    }),
                    'isBase64Encoded': False
                }
            
            # Продляем подписку на 14 дней
            new_subscription_end = subscription_end + timedelta(days=14)
            
            cur.execute(f'''
                UPDATE {schema}.listings
                SET 
                    subscription_expires_at = %s,
                    gold_gift_sent_at = NOW()
                WHERE id = %s
            ''', (new_subscription_end, listing_id))
            
            # Создаем запись о подарке
            cur.execute(f'''
                INSERT INTO {schema}.transactions (owner_id, amount, type, description, balance_after)
                VALUES (
                    %s, 
                    0, 
                    'gift', 
                    %s,
                    (SELECT balance + bonus_balance FROM {schema}.owners WHERE id = %s)
                )
            ''', (
                listing['owner_id'],
                f'🎁 Подарок "Пакет Золото" +14 дней к подписке объекта "{listing["title"]}"',
                listing['owner_id']
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Подарок успешно отправлен',
                    'new_subscription_end': new_subscription_end.isoformat()
                }, default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        print(f'ERROR: {str(e)}')
        import traceback
        traceback.print_exc()
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()