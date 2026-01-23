import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    """
    Webhook для маршрутизации входящих звонков с МТС Exolve.
    Определяет объект по истории звонков и переадресует на владельца.
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
    
    client_phone = data.get('from')
    virtual_number = data.get('to')
    
    if not client_phone or not virtual_number:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'from and to parameters are required'})
        }
    
    try:
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Ищем в истории последний показ этого номера этому клиенту
        cur.execute("""
            SELECT 
                ct.listing_id,
                l.short_title,
                l.phone as owner_phone,
                l.id as listing_number
            FROM call_tracking ct
            JOIN listings l ON ct.listing_id = l.id
            WHERE ct.client_phone = %s 
              AND ct.virtual_number = %s
            ORDER BY ct.shown_at DESC
            LIMIT 1
        """, (client_phone, virtual_number))
        
        result = cur.fetchone()
        
        # Обновляем время звонка
        if result:
            cur.execute("""
                UPDATE call_tracking 
                SET called_at = NOW()
                WHERE listing_id = %s 
                  AND client_phone = %s
                  AND virtual_number = %s
                  AND called_at IS NULL
            """, (result['listing_id'], client_phone, virtual_number))
            conn.commit()
        
        cur.close()
        conn.close()
        
        if result:
            # Формат ответа для МТС Exolve webhook
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'destination': result['owner_phone'],
                    'listing_id': result['listing_id'],
                    'listing_title': result['short_title']
                })
            }
        else:
            # Номер не найден в истории - МТС не переадресует
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'No call history found'
                })
            }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }