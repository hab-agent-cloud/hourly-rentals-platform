import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime


def handler(event: dict, context) -> dict:
    '''Управление сообщениями между сотрудниками (менеджер, ОМ, УМ, суперадмин)'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ['DATABASE_URL']
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            admin_id = event.get('queryStringParameters', {}).get('admin_id')
            
            if not admin_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'admin_id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT 
                    em.id,
                    em.message,
                    em.attachments,
                    em.is_read,
                    em.related_task_id,
                    em.message_type,
                    em.created_at,
                    sender.full_name as sender_name,
                    sender.role as sender_role,
                    recipient.full_name as recipient_name,
                    recipient.role as recipient_role
                FROM t_p39732784_hourly_rentals_platf.employee_messages em
                LEFT JOIN t_p39732784_hourly_rentals_platf.admins sender ON em.sender_id = sender.id
                LEFT JOIN t_p39732784_hourly_rentals_platf.admins recipient ON em.recipient_id = recipient.id
                WHERE em.sender_id = %s OR em.recipient_id = %s
                ORDER BY em.created_at DESC
            """, (admin_id, admin_id))
            
            messages = [dict(row) for row in cur.fetchall()]
            
            for msg in messages:
                if msg['created_at']:
                    msg['created_at'] = msg['created_at'].isoformat()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'messages': messages}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            sender_id = body.get('sender_id')
            recipient_id = body.get('recipient_id')
            message = body.get('message')
            attachments = body.get('attachments', [])
            related_task_id = body.get('related_task_id')
            message_type = body.get('message_type', 'regular')
            
            if not sender_id or not recipient_id or not message:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'sender_id, recipient_id и message обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO t_p39732784_hourly_rentals_platf.employee_messages 
                (sender_id, recipient_id, message, attachments, related_task_id, message_type, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
                RETURNING id
            """, (sender_id, recipient_id, message, json.dumps(attachments), related_task_id, message_type))
            
            message_id = cur.fetchone()['id']
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message_id': message_id,
                    'message': 'Сообщение отправлено'
                }),
                'isBase64Encoded': False
            }
        
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        print(f'Error: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }
