import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime


def handler(event: dict, context) -> dict:
    '''CRON: Проверка просроченных задач и отправка уведомлений ОМ'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ['DATABASE_URL']
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        now = datetime.now()
        
        cur.execute("""
            SELECT 
                mt.id,
                mt.title,
                mt.description,
                mt.deadline,
                mt.manager_id,
                mt.om_id,
                m.full_name as manager_name
            FROM t_p39732784_hourly_rentals_platf.manager_tasks mt
            LEFT JOIN t_p39732784_hourly_rentals_platf.admins m ON mt.manager_id = m.id
            WHERE mt.completed = FALSE 
              AND mt.deadline < NOW()
              AND mt.om_id IS NOT NULL
              AND NOT EXISTS (
                SELECT 1 FROM t_p39732784_hourly_rentals_platf.employee_messages em
                WHERE em.related_task_id = mt.id 
                  AND em.message_type = 'task_overdue_notification'
              )
        """)
        
        overdue_tasks = [dict(row) for row in cur.fetchall()]
        
        notifications_sent = 0
        
        for task in overdue_tasks:
            message = f"⏰ НАПОМИНАНИЕ: Задача просрочена!\n\n" \
                     f"Задача: \"{task['title']}\"\n" \
                     f"Менеджер: {task['manager_name']}\n" \
                     f"Описание: {task['description']}\n" \
                     f"Срок был: {task['deadline'].strftime('%d.%m.%Y %H:%M')}\n" \
                     f"Просрочена с: {now.strftime('%d.%m.%Y %H:%M')}\n\n" \
                     f"❗ Задача до сих пор не выполнена"
            
            cur.execute("""
                INSERT INTO t_p39732784_hourly_rentals_platf.employee_messages 
                (sender_id, recipient_id, message, related_task_id, message_type, created_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
            """, (task['manager_id'], task['om_id'], message, task['id'], 'task_overdue_notification'))
            
            notifications_sent += 1
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'overdue_tasks_found': len(overdue_tasks),
                'notifications_sent': notifications_sent,
                'message': f'Проверка завершена: найдено {len(overdue_tasks)} просроченных задач, отправлено {notifications_sent} уведомлений'
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
