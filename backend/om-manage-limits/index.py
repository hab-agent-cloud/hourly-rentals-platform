"""API для управления лимитами менеджеров (для ОМ)"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """Управление лимитами объектов для менеджеров в команде ОМ"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        
        # GET - получить менеджеров в команде ОМ
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            om_id = params.get('om_id')
            
            if not om_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указан om_id'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Проверяем, что запрашивающий действительно ОМ
                cur.execute("""
                    SELECT role FROM t_p39732784_hourly_rentals_platf.admins
                    WHERE id = %s AND role = 'operational_manager' AND is_active = true
                """, (int(om_id),))
                
                if not cur.fetchone():
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Доступ запрещен'}),
                        'isBase64Encoded': False
                    }
                
                # Получаем менеджеров в команде
                cur.execute("""
                    SELECT 
                        a.id, a.name, a.email, a.manager_level,
                        a.object_limit, a.subscription_days_limit,
                        a.commission_percent,
                        COUNT(ml.id) as current_objects
                    FROM t_p39732784_hourly_rentals_platf.manager_hierarchy mh
                    JOIN t_p39732784_hourly_rentals_platf.admins a ON mh.manager_id = a.id
                    LEFT JOIN t_p39732784_hourly_rentals_platf.manager_listings ml ON a.id = ml.manager_id
                    WHERE mh.operational_manager_id = %s AND a.is_active = true
                    GROUP BY a.id, a.name, a.email, a.manager_level, a.object_limit, 
                             a.subscription_days_limit, a.commission_percent
                    ORDER BY a.name
                """, (int(om_id),))
                
                managers = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'managers': managers}, default=str),
                    'isBase64Encoded': False
                }
        
        # PUT - обновить лимиты менеджера
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            om_id = body.get('om_id')
            manager_id = body.get('manager_id')
            object_limit = body.get('object_limit')
            subscription_days_limit = body.get('subscription_days_limit')
            
            if not all([om_id, manager_id]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указаны обязательные поля'}),
                    'isBase64Encoded': False
                }
            
            conn.autocommit = False
            
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    # Проверяем, что запрашивающий - ОМ
                    cur.execute("""
                        SELECT role FROM t_p39732784_hourly_rentals_platf.admins
                        WHERE id = %s AND role = 'operational_manager' AND is_active = true
                    """, (int(om_id),))
                    
                    if not cur.fetchone():
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Доступ запрещен'}),
                            'isBase64Encoded': False
                        }
                    
                    # Проверяем, что менеджер в команде ОМ
                    cur.execute("""
                        SELECT mh.manager_id 
                        FROM t_p39732784_hourly_rentals_platf.manager_hierarchy mh
                        WHERE mh.operational_manager_id = %s AND mh.manager_id = %s
                    """, (int(om_id), int(manager_id)))
                    
                    if not cur.fetchone():
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Менеджер не найден в вашей команде'}),
                            'isBase64Encoded': False
                        }
                    
                    # Обновляем лимиты
                    update_fields = []
                    update_values = []
                    
                    if object_limit is not None:
                        update_fields.append('object_limit = %s')
                        update_values.append(int(object_limit))
                    
                    if subscription_days_limit is not None:
                        update_fields.append('subscription_days_limit = %s')
                        update_values.append(int(subscription_days_limit))
                    
                    if not update_fields:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Нет данных для обновления'}),
                            'isBase64Encoded': False
                        }
                    
                    update_values.append(int(manager_id))
                    
                    cur.execute(f"""
                        UPDATE t_p39732784_hourly_rentals_platf.admins
                        SET {', '.join(update_fields)}
                        WHERE id = %s
                    """, update_values)
                    
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'message': 'Лимиты обновлены'
                        }),
                        'isBase64Encoded': False
                    }
                    
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
            
    except Exception as e:
        import traceback
        print(f"[ERROR] {str(e)}")
        print(f"[TRACEBACK] {traceback.format_exc()}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
