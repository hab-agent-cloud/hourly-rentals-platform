import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    """
    Webhook для маршрутизации входящих звонков с АТС.
    Определяет объект по истории звонков и возвращает данные для соединения.
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
            # НАШЛИ объект в истории
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'action': 'ivr_confirm',
                    'message': f"Здравствуйте! Вы звоните по объекту {result['short_title']}. Нажмите 1 для соединения с владельцем",
                    'if_pressed_1': {
                        'action': 'connect',
                        'to': result['owner_phone'],
                        'whisper': f"Звонок с сайта 120 минут по объекту номер {result['listing_number']}"
                    }
                })
            }
        else:
            # НЕ НАШЛИ в истории
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'action': 'play_message',
                    'message': 'Здравствуйте! Вы позвонили в сервис 120 минут. К сожалению, мы не смогли определить объект. Пожалуйста, зайдите на сайт 120 минут точка ру, найдите нужный объект и нажмите кнопку Позвонить. Спасибо за понимание!',
                    'then': 'hangup'
                })
            }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }