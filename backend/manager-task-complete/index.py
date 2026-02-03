import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime


def handler(event: dict, context) -> dict:
    '''Завершение задачи менеджером с автоматической отправкой уведомления ОМ'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        task_id = body.get('task_id')
        manager_id = body.get('manager_id')
        
        if not task_id or not manager_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'task_id и manager_id обязательны'}),
                'isBase64Encoded': False
            }
        
        dsn = os.environ['DATABASE_URL']
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT 
                mt.id,
                mt.title,
                mt.description,
                mt.deadline,
                mt.om_id,
                mt.manager_id,
                mt.completed,
                m.full_name as manager_name
            FROM t_p39732784_hourly_rentals_platf.manager_tasks mt
            LEFT JOIN t_p39732784_hourly_rentals_platf.admins m ON mt.manager_id = m.id
            WHERE mt.id = %s AND mt.manager_id = %s
        """, (task_id, manager_id))
        
        task = cur.fetchone()
        
        if not task:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Задача не найдена или не принадлежит данному менеджеру'}),
                'isBase64Encoded': False
            }
        
        if task['completed']:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Задача уже выполнена'}),
                'isBase64Encoded': False
            }
        
        now = datetime.now()
        is_overdue = task['deadline'] and task['deadline'] < now
        
        cur.execute("""
            UPDATE t_p39732784_hourly_rentals_platf.manager_tasks
            SET completed = TRUE,
                completed_at = NOW(),
                completed_by = %s,
                is_overdue = %s
            WHERE id = %s
        """, (manager_id, is_overdue, task_id))
        
        if task['om_id']:
            if is_overdue:
                message = f"❌ ПРОСРОЧЕНО: Задача \"{task['title']}\" выполнена с опозданием\n\n" \
                         f"Менеджер: {task['manager_name']}\n" \
                         f"Описание: {task['description']}\n" \
                         f"Срок: {task['deadline'].strftime('%d.%m.%Y %H:%M') if task['deadline'] else 'Не указан'}\n" \
                         f"Выполнено: {now.strftime('%d.%m.%Y %H:%M')}"
                message_type = 'task_overdue'
            else:
                message = f"✅ Задача \"{task['title']}\" выполнена\n\n" \
                         f"Менеджер: {task['manager_name']}\n" \
                         f"Описание: {task['description']}\n" \
                         f"Срок: {task['deadline'].strftime('%d.%m.%Y %H:%M') if task['deadline'] else 'Не указан'}\n" \
                         f"Выполнено: {now.strftime('%d.%m.%Y %H:%M')}"
                message_type = 'task_completed'
            
            cur.execute("""
                INSERT INTO t_p39732784_hourly_rentals_platf.employee_messages 
                (sender_id, recipient_id, message, related_task_id, message_type, created_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
            """, (manager_id, task['om_id'], message, task_id, message_type))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': 'Задача отмечена как выполненная, уведомление отправлено ОМ',
                'is_overdue': is_overdue
            }),
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
