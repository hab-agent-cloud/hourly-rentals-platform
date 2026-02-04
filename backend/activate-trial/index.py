import json
import os
import psycopg2
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    '''API для активации бесплатной пробной подписки на 14 дней'''
    
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
        
        # Проверяем, не активировал ли владелец уже пробную подписку
        cur.execute('''
            SELECT trial_activated_at 
            FROM listings 
            WHERE id = %s
        ''', (listing_id,))
        
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
        
        trial_activated_at = row[0]
        
        if trial_activated_at:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Пробная подписка уже была активирована ранее',
                    'activated_at': trial_activated_at.isoformat()
                }),
                'isBase64Encoded': False
            }
        
        # Активируем пробную подписку на 14 дней
        now = datetime.utcnow()
        trial_end = now + timedelta(days=14)
        
        cur.execute('''
            UPDATE listings
            SET 
                trial_activated_at = %s,
                subscription_expires_at = %s,
                status = 'active',
                updated_at = %s
            WHERE id = %s
        ''', (now, trial_end, now, listing_id))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Пробная подписка на 14 дней успешно активирована',
                'expires_at': trial_end.isoformat()
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