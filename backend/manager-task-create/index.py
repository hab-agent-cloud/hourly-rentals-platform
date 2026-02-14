import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta


SCHEMA = 't_p39732784_hourly_rentals_platf'


def handler(event: dict, context) -> dict:
    '''Создание задачи для менеджера от суперадмина или ОМ'''
    
    method = event.get('httpMethod', 'POST')
    
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
    
    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            admin_id = params.get('admin_id')
            
            if not admin_id:
                return _response(400, {'error': 'admin_id обязателен'})
            
            cur.execute(f"SELECT id, role FROM {SCHEMA}.admins WHERE id = %s", (int(admin_id),))
            admin = cur.fetchone()
            
            if not admin:
                return _response(404, {'error': 'Админ не найден'})
            
            if admin['role'] == 'superadmin':
                cur.execute(f"""
                    SELECT mt.*, a.name as manager_name, om.name as om_name
                    FROM {SCHEMA}.manager_tasks mt
                    LEFT JOIN {SCHEMA}.admins a ON mt.manager_id = a.id
                    LEFT JOIN {SCHEMA}.admins om ON mt.om_id = om.id
                    ORDER BY mt.created_at DESC
                    LIMIT 100
                """)
            elif admin['role'] in ('operational_manager', 'om'):
                cur.execute(f"""
                    SELECT mt.*, a.name as manager_name, om.name as om_name
                    FROM {SCHEMA}.manager_tasks mt
                    LEFT JOIN {SCHEMA}.admins a ON mt.manager_id = a.id
                    LEFT JOIN {SCHEMA}.admins om ON mt.om_id = om.id
                    WHERE mt.om_id = %s
                    ORDER BY mt.created_at DESC
                    LIMIT 100
                """, (int(admin_id),))
            else:
                return _response(403, {'error': 'Недостаточно прав'})
            
            tasks = [dict(row) for row in cur.fetchall()]
            
            cur.execute(f"""
                SELECT id, name, role FROM {SCHEMA}.admins 
                WHERE role = 'manager' AND is_active = true
                ORDER BY name
            """)
            managers = [dict(row) for row in cur.fetchall()]
            
            return _response(200, {'tasks': tasks, 'managers': managers})
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action', 'create')
            
            if action == 'create':
                admin_id = body.get('admin_id')
                manager_ids = body.get('manager_ids', [])
                title = body.get('title', '').strip()
                description = body.get('description', '').strip()
                deadline_days = body.get('deadline_days', 7)
                
                if not admin_id or not manager_ids or not title:
                    return _response(400, {'error': 'admin_id, manager_ids и title обязательны'})
                
                cur.execute(f"SELECT id, role FROM {SCHEMA}.admins WHERE id = %s", (int(admin_id),))
                admin = cur.fetchone()
                
                if not admin or admin['role'] not in ('superadmin', 'operational_manager', 'om'):
                    return _response(403, {'error': 'Недостаточно прав для создания задач'})
                
                deadline = datetime.now() + timedelta(days=int(deadline_days))
                created_count = 0
                
                for mid in manager_ids:
                    cur.execute(f"""
                        INSERT INTO {SCHEMA}.manager_tasks 
                        (manager_id, om_id, title, description, deadline, completed, created_at)
                        VALUES (%s, %s, %s, %s, %s, false, NOW())
                    """, (int(mid), int(admin_id), title, description, deadline))
                    created_count += 1
                
                conn.commit()
                return _response(200, {
                    'success': True,
                    'created_count': created_count,
                    'message': f'Создано {created_count} задач'
                })
            
            elif action == 'delete':
                admin_id = body.get('admin_id')
                task_id = body.get('task_id')
                
                if not admin_id or not task_id:
                    return _response(400, {'error': 'admin_id и task_id обязательны'})
                
                cur.execute(f"SELECT role FROM {SCHEMA}.admins WHERE id = %s", (int(admin_id),))
                admin = cur.fetchone()
                
                if not admin or admin['role'] not in ('superadmin', 'operational_manager', 'om'):
                    return _response(403, {'error': 'Недостаточно прав'})
                
                cur.execute(f"DELETE FROM {SCHEMA}.manager_tasks WHERE id = %s", (int(task_id),))
                conn.commit()
                
                return _response(200, {'success': True, 'message': 'Задача удалена'})
            
            return _response(400, {'error': 'Неизвестное действие'})
        
        return _response(405, {'error': 'Method not allowed'})
        
    except Exception as e:
        conn.rollback()
        return _response(500, {'error': str(e)})
    finally:
        cur.close()
        conn.close()


def _response(status, body):
    return {
        'statusCode': status,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(body, default=str),
        'isBase64Encoded': False
    }
