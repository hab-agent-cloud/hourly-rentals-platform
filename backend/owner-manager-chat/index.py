import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для сообщений между владельцами и менеджерами'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            # Получить сообщения для владельца или менеджера
            owner_id = event.get('queryStringParameters', {}).get('owner_id')
            manager_id = event.get('queryStringParameters', {}).get('manager_id')
            
            if owner_id:
                # Получаем сообщения для владельца
                cur.execute('''
                    SELECT 
                        m.id, m.manager_id, m.listing_id, m.sender_type, 
                        m.message, m.is_read, m.created_at,
                        e.name as manager_name, e.phone as manager_phone,
                        l.title as listing_name
                    FROM owner_manager_messages m
                    LEFT JOIN employees e ON m.manager_id = e.id
                    LEFT JOIN listings l ON m.listing_id = l.id
                    WHERE m.owner_id = %s
                    ORDER BY m.created_at ASC
                ''', (owner_id,))
                
                rows = cur.fetchall()
                messages = []
                manager_info = None
                
                for row in rows:
                    messages.append({
                        'id': row[0],
                        'manager_id': row[1],
                        'listing_id': row[2],
                        'sender_type': row[3],
                        'message': row[4],
                        'is_read': row[5],
                        'created_at': row[6].isoformat() if row[6] else None,
                        'listing_name': row[9]
                    })
                    
                    if not manager_info and row[1]:
                        manager_info = {
                            'id': row[1],
                            'name': row[7],
                            'phone': row[8]
                        }
                
                # Если менеджер не найден в сообщениях, получаем из первого объекта владельца
                if not manager_info:
                    cur.execute('''
                        SELECT e.id, e.name, e.phone
                        FROM listings l
                        LEFT JOIN employees e ON l.created_by_employee_id = e.id
                        WHERE l.owner_id = %s AND e.id IS NOT NULL
                        LIMIT 1
                    ''', (owner_id,))
                    
                    row = cur.fetchone()
                    if row:
                        manager_info = {
                            'id': row[0],
                            'name': row[1],
                            'phone': row[2]
                        }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'messages': messages,
                        'manager': manager_info
                    }),
                    'isBase64Encoded': False
                }
                
            elif manager_id:
                # Получаем сообщения для менеджера (сгруппированные по владельцам)
                cur.execute('''
                    SELECT DISTINCT
                        m.owner_id,
                        o.full_name as owner_name,
                        o.phone as owner_phone,
                        COUNT(*) FILTER (WHERE m.sender_type = 'owner' AND NOT m.is_read) as unread_count,
                        MAX(m.created_at) as last_message_time
                    FROM owner_manager_messages m
                    LEFT JOIN owners o ON m.owner_id = o.id
                    WHERE m.manager_id = %s
                    GROUP BY m.owner_id, o.full_name, o.phone
                    ORDER BY MAX(m.created_at) DESC
                ''', (manager_id,))
                
                rows = cur.fetchall()
                conversations = []
                
                for row in rows:
                    conversations.append({
                        'owner_id': row[0],
                        'owner_name': row[1],
                        'owner_phone': row[2],
                        'unread_count': row[3],
                        'last_message_time': row[4].isoformat() if row[4] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'conversations': conversations}),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'owner_id or manager_id is required'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            # Отправить сообщение
            body_str = event.get('body', '{}')
            if not body_str or body_str.strip() == '':
                body_str = '{}'
            body = json.loads(body_str)
            
            owner_id = body.get('owner_id')
            manager_id = body.get('manager_id')
            sender_type = body.get('sender_type')  # 'owner' или 'manager'
            message = body.get('message')
            listing_id = body.get('listing_id')
            
            if not all([owner_id, manager_id, sender_type, message]):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'owner_id, manager_id, sender_type, and message are required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                INSERT INTO owner_manager_messages 
                (owner_id, manager_id, listing_id, sender_type, message)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, created_at
            ''', (owner_id, manager_id, listing_id, sender_type, message))
            
            message_id, created_at = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message_id': message_id,
                    'created_at': created_at.isoformat()
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            # Отметить сообщения как прочитанные
            body_str = event.get('body', '{}')
            if not body_str or body_str.strip() == '':
                body_str = '{}'
            body = json.loads(body_str)
            
            owner_id = body.get('owner_id')
            manager_id = body.get('manager_id')
            mark_as_read_by = body.get('mark_as_read_by')  # 'owner' или 'manager'
            
            if mark_as_read_by == 'owner' and owner_id:
                # Владелец читает сообщения от менеджера
                cur.execute('''
                    UPDATE owner_manager_messages
                    SET is_read = TRUE
                    WHERE owner_id = %s AND sender_type = 'manager' AND NOT is_read
                ''', (owner_id,))
            elif mark_as_read_by == 'manager' and manager_id and owner_id:
                # Менеджер читает сообщения от владельца
                cur.execute('''
                    UPDATE owner_manager_messages
                    SET is_read = TRUE
                    WHERE manager_id = %s AND owner_id = %s AND sender_type = 'owner' AND NOT is_read
                ''', (manager_id, owner_id))
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Invalid parameters'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
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
