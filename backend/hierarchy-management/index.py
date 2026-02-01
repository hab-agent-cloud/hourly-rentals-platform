"""API для управления иерархией менеджеров (ОМ/УМ)"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Привязка/отвязка менеджеров к ОМ и ОМ к УМ"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
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
        action = body.get('action')  # 'attach_manager', 'detach_manager', 'attach_om', 'detach_om'
        initiator_id = body.get('initiator_id')  # ОМ или УМ
        target_id = body.get('target_id')  # менеджер или ОМ
        
        if not all([action, initiator_id, target_id]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указаны обязательные поля'}),
                'isBase64Encoded': False
            }
        
        initiator_id_int = int(initiator_id)
        target_id_int = int(target_id)
        
        conn = get_db_connection()
        conn.autocommit = False
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Проверяем права инициатора
                cur.execute(f"""
                    SELECT role FROM admins WHERE id = {initiator_id_int} AND is_active = true
                """)
                initiator = cur.fetchone()
                
                if not initiator:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Нет прав доступа'}),
                        'isBase64Encoded': False
                    }
                
                # ПРИВЯЗАТЬ МЕНЕДЖЕРА К ОМ
                if action == 'attach_manager':
                    if initiator['role'] not in ['operational_manager', 'chief_manager', 'superadmin']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Только ОМ/УМ/суперадмин может привязывать менеджеров'}),
                            'isBase64Encoded': False
                        }
                    
                    # Проверяем, что target - менеджер
                    cur.execute(f"SELECT role FROM admins WHERE id = {target_id_int}")
                    target = cur.fetchone()
                    if not target or target['role'] != 'manager':
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Целевой пользователь не является менеджером'}),
                            'isBase64Encoded': False
                        }
                    
                    # Проверяем, не привязан ли уже
                    cur.execute(f"""
                        SELECT operational_manager_id FROM manager_hierarchy WHERE manager_id = {target_id_int}
                    """)
                    existing = cur.fetchone()
                    
                    if existing and existing['operational_manager_id']:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Менеджер уже привязан к другому ОМ'}),
                            'isBase64Encoded': False
                        }
                    
                    # Привязываем
                    if existing:
                        cur.execute(f"""
                            UPDATE manager_hierarchy 
                            SET operational_manager_id = {initiator_id_int}, updated_at = NOW()
                            WHERE manager_id = {target_id_int}
                        """)
                    else:
                        cur.execute(f"""
                            INSERT INTO manager_hierarchy (manager_id, operational_manager_id)
                            VALUES ({target_id_int}, {initiator_id_int})
                        """)
                    
                    message = 'Менеджер привязан к ОМ'
                
                # ОТВЯЗАТЬ МЕНЕДЖЕРА ОТ ОМ
                elif action == 'detach_manager':
                    if initiator['role'] not in ['operational_manager', 'chief_manager', 'superadmin']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Нет прав для отвязки менеджера'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(f"""
                        UPDATE manager_hierarchy 
                        SET operational_manager_id = NULL, updated_at = NOW()
                        WHERE manager_id = {target_id_int} AND operational_manager_id = {initiator_id_int}
                    """)
                    
                    if cur.rowcount == 0:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Менеджер не привязан к вам'}),
                            'isBase64Encoded': False
                        }
                    
                    message = 'Менеджер отвязан от ОМ'
                
                # ПРИВЯЗАТЬ ОМ К УМ
                elif action == 'attach_om':
                    if initiator['role'] not in ['chief_manager', 'superadmin']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Только УМ/суперадмин может привязывать ОМ'}),
                            'isBase64Encoded': False
                        }
                    
                    # Проверяем, что target - ОМ
                    cur.execute(f"SELECT role FROM admins WHERE id = {target_id_int}")
                    target = cur.fetchone()
                    if not target or target['role'] != 'operational_manager':
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Целевой пользователь не является ОМ'}),
                            'isBase64Encoded': False
                        }
                    
                    # Обновляем всех менеджеров этого ОМ
                    cur.execute(f"""
                        UPDATE manager_hierarchy 
                        SET chief_manager_id = {initiator_id_int}, updated_at = NOW()
                        WHERE operational_manager_id = {target_id_int}
                    """)
                    
                    message = 'ОМ привязан к УМ'
                
                # ОТВЯЗАТЬ ОМ ОТ УМ
                elif action == 'detach_om':
                    if initiator['role'] not in ['chief_manager', 'superadmin']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Нет прав для отвязки ОМ'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(f"""
                        UPDATE manager_hierarchy 
                        SET chief_manager_id = NULL, updated_at = NOW()
                        WHERE operational_manager_id = {target_id_int} AND chief_manager_id = {initiator_id_int}
                    """)
                    
                    message = 'ОМ отвязан от УМ'
                
                else:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неизвестное действие'}),
                        'isBase64Encoded': False
                    }
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': message}),
                    'isBase64Encoded': False
                }
                
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
            
    except ValueError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный формат данных'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }