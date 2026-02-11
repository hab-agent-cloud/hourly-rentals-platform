import json
import os
import jwt
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import hashlib

def handler(event: dict, context) -> dict:
    '''API для управления сотрудниками (админами) - просмотр, создание, редактирование, удаление'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Проверка авторизации
    auth_header = event.get('headers', {}).get('X-Authorization', '')
    token = auth_header.replace('Bearer ', '') if auth_header else ''
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        # Верификация JWT токена
        try:
            jwt_secret = os.environ['JWT_SECRET']
            payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
            admin_id = payload.get('admin_id')
        except:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid token'}),
                'isBase64Encoded': False
            }
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Проверка прав доступа
            cur.execute("""
                SELECT id, role, name FROM t_p39732784_hourly_rentals_platf.admins 
                WHERE id = %s AND is_active = true
            """, (admin_id,))
            admin = cur.fetchone()
            
            print(f"[DEBUG] Admin check: admin_id={admin_id}, admin={admin}")
            
            if not admin:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Access denied - admin not found'}),
                    'isBase64Encoded': False
                }
            
            # GET - получить список всех сотрудников
            if method == 'GET':
                query_params = event.get('queryStringParameters') or {}
                employee_id = query_params.get('employee_id') or query_params.get('id')
                
                print(f"[DEBUG] GET request: employee_id={employee_id}, admin_id={admin_id}, admin_role={admin['role']}")
                
                # Если запрашивается информация о конкретном сотруднике
                # Разрешить, если это superadmin ИЛИ сотрудник запрашивает свои данные
                if employee_id and (admin['role'] != 'superadmin' and str(admin_id) != str(employee_id)):
                    print(f"[DEBUG] Access denied: employee_id={employee_id}, admin_id={admin_id}, role={admin['role']}")
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'Access denied - employee requesting: {employee_id}, logged in as: {admin_id}'}),
                        'isBase64Encoded': False
                    }
                
                # Для просмотра списка всех сотрудников - только superadmin
                if not employee_id and admin['role'] != 'superadmin':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Access denied'}),
                        'isBase64Encoded': False
                    }
                
                if employee_id:
                    # Получить данные сотрудника
                    cur.execute("""
                        SELECT id, email, name, role, permissions, is_active, 
                               created_at, last_login, login
                        FROM t_p39732784_hourly_rentals_platf.admins
                        WHERE id = %s
                    """, (employee_id,))
                    employee = cur.fetchone()
                    
                    if not employee:
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Employee not found'}),
                            'isBase64Encoded': False
                        }
                    
                    # Подсчитать заработок из таблицы employee_bonuses
                    cur.execute("""
                        SELECT 
                            COALESCE(SUM(bonus_amount), 0) as total,
                            COALESCE(SUM(CASE WHEN is_paid = true THEN bonus_amount ELSE 0 END), 0) as paid,
                            COALESCE(SUM(CASE WHEN is_paid = false OR is_paid IS NULL THEN bonus_amount ELSE 0 END), 0) as pending
                        FROM t_p39732784_hourly_rentals_platf.employee_bonuses
                        WHERE admin_id = %s
                    """, (employee_id,))
                    earnings = cur.fetchone()
                    
                    # Получить историю бонусов
                    cur.execute("""
                        SELECT 
                            b.id, b.entity_type, b.entity_id, b.entity_name,
                            b.bonus_amount as earning, b.is_paid as earning_paid,
                            b.created_at, b.notes as description
                        FROM t_p39732784_hourly_rentals_platf.employee_bonuses b
                        WHERE b.admin_id = %s
                        ORDER BY b.created_at DESC
                        LIMIT 100
                    """, (employee_id,))
                    actions = cur.fetchall()
                    
                    # Добавить заработок в данные сотрудника
                    employee_dict = dict(employee)
                    employee_dict['earnings'] = {
                        'total': float(earnings['total']) if earnings else 0,
                        'paid': float(earnings['paid']) if earnings else 0,
                        'pending': float(earnings['pending']) if earnings else 0
                    }
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'employee': employee_dict,
                            'actions': [dict(a) for a in actions]
                        }, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    # Получить список всех сотрудников
                    cur.execute("""
                        SELECT id, email, name, role, permissions, is_active, 
                               created_at, last_login, login
                        FROM t_p39732784_hourly_rentals_platf.admins
                        ORDER BY created_at DESC
                    """)
                    employees = cur.fetchall()
                    
                    # Получить количество действий для каждого сотрудника
                    cur.execute("""
                        SELECT admin_id, COUNT(*) as action_count
                        FROM t_p39732784_hourly_rentals_platf.admin_action_logs
                        GROUP BY admin_id
                    """)
                    action_counts = {row['admin_id']: row['action_count'] for row in cur.fetchall()}
                    
                    employees_with_counts = []
                    for emp in employees:
                        emp_dict = dict(emp)
                        emp_dict['action_count'] = action_counts.get(emp['id'], 0)
                        employees_with_counts.append(emp_dict)
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(employees_with_counts, default=str),
                        'isBase64Encoded': False
                    }
            
            # POST - создать нового сотрудника (только superadmin)
            elif method == 'POST':
                if admin['role'] != 'superadmin':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Access denied'}),
                        'isBase64Encoded': False
                    }
                data = json.loads(event.get('body', '{}'))
                email = data.get('email')
                name = data.get('name')
                password = data.get('password')
                role = data.get('role', 'employee')
                permissions = data.get('permissions', {'owners': False, 'listings': True, 'settings': False})
                login = data.get('login')
                
                if not email or not name or not password or not login:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'}),
                        'isBase64Encoded': False
                    }
                
                # Проверка на существование
                cur.execute("""
                    SELECT id FROM t_p39732784_hourly_rentals_platf.admins 
                    WHERE email = %s OR login = %s
                """, (email, login))
                if cur.fetchone():
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email or login already exists'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                cur.execute("""
                    INSERT INTO t_p39732784_hourly_rentals_platf.admins 
                    (email, name, password_hash, role, permissions, login, is_active)
                    VALUES (%s, %s, %s, %s, %s, %s, true)
                    RETURNING id, email, name, role, permissions, is_active, created_at, login
                """, (email, name, password_hash, role, json.dumps(permissions), login))
                
                new_employee = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(new_employee), default=str),
                    'isBase64Encoded': False
                }
            
            # PUT - обновить сотрудника (только superadmin)
            elif method == 'PUT':
                if admin['role'] != 'superadmin':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Access denied'}),
                        'isBase64Encoded': False
                    }
                
                data = json.loads(event.get('body', '{}'))
                employee_id = data.get('id')
                
                if not employee_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing employee id'}),
                        'isBase64Encoded': False
                    }
                
                updates = []
                values = []
                
                if 'name' in data:
                    updates.append('name = %s')
                    values.append(data['name'])
                if 'email' in data:
                    updates.append('email = %s')
                    values.append(data['email'])
                if 'role' in data:
                    updates.append('role = %s')
                    values.append(data['role'])
                if 'permissions' in data:
                    updates.append('permissions = %s')
                    values.append(json.dumps(data['permissions']))
                if 'is_active' in data:
                    updates.append('is_active = %s')
                    values.append(data['is_active'])
                if 'password' in data and data['password']:
                    updates.append('password_hash = %s')
                    values.append(hashlib.sha256(data['password'].encode()).hexdigest())
                if 'login' in data:
                    updates.append('login = %s')
                    values.append(data['login'])
                if 'copywriter_earnings' in data:
                    updates.append('copywriter_earnings = %s')
                    values.append(data['copywriter_earnings'])
                
                if not updates:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'No fields to update'}),
                        'isBase64Encoded': False
                    }
                
                values.append(employee_id)
                query = f"""
                    UPDATE t_p39732784_hourly_rentals_platf.admins 
                    SET {', '.join(updates)}
                    WHERE id = %s
                    RETURNING id, email, name, role, permissions, is_active, created_at, last_login, login
                """
                
                cur.execute(query, values)
                updated_employee = cur.fetchone()
                conn.commit()
                
                if not updated_employee:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Employee not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(updated_employee), default=str),
                    'isBase64Encoded': False
                }
            
            # DELETE - удалить сотрудника (только superadmin)
            elif method == 'DELETE':
                if admin['role'] != 'superadmin':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Access denied'}),
                        'isBase64Encoded': False
                    }
                
                query_params = event.get('queryStringParameters', {})
                employee_id = query_params.get('id')
                
                if not employee_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing employee id'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("""
                    DELETE FROM t_p39732784_hourly_rentals_platf.admins 
                    WHERE id = %s
                    RETURNING id
                """, (employee_id,))
                
                deleted = cur.fetchone()
                conn.commit()
                
                if not deleted:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Employee not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        conn.close()