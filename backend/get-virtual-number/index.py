import json
import os
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    """
    Выдаёт виртуальный номер из пула для звонка по объекту.
    Привязывает номер к объекту на 30 минут.
    """
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body = event.get('body', '{}')
    if not body or body == '':
        body = '{}'
    
    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    
    listing_id = data.get('listing_id')
    client_phone = data.get('client_phone')
    
    if not listing_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'listing_id is required'})
        }
    
    try:
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Освобождаем истёкшие номера
        cur.execute("""
            UPDATE virtual_numbers 
            SET is_busy = FALSE, 
                assigned_listing_id = NULL, 
                assigned_at = NULL,
                assigned_until = NULL
            WHERE is_busy = TRUE 
              AND assigned_until < NOW()
        """)
        
        # Ищем свободный номер
        cur.execute("""
            SELECT phone 
            FROM virtual_numbers 
            WHERE is_busy = FALSE 
            LIMIT 1
            FOR UPDATE SKIP LOCKED
        """)
        
        result = cur.fetchone()
        
        if not result:
            conn.close()
            return {
                'statusCode': 503,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'All virtual numbers are busy. Please try again in a few minutes.'
                })
            }
        
        virtual_number = result['phone']
        expires_at = datetime.now() + timedelta(minutes=30)
        
        # Привязываем номер к объекту
        cur.execute("""
            UPDATE virtual_numbers 
            SET is_busy = TRUE,
                assigned_listing_id = %s,
                assigned_at = NOW(),
                assigned_until = %s
            WHERE phone = %s
        """, (listing_id, expires_at, virtual_number))
        
        # Записываем в историю звонков
        cur.execute("""
            INSERT INTO call_tracking 
            (virtual_number, listing_id, client_phone, shown_at, expires_at)
            VALUES (%s, %s, %s, NOW(), %s)
        """, (virtual_number, listing_id, client_phone, expires_at))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'virtual_number': virtual_number,
                'expires_at': expires_at.isoformat()
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }