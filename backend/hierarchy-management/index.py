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
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
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
                'body': json.dumps({'error': 'Не указаны обязательные поля'})
            }
        
        conn = get_db_connection()
        conn.autocommit = False
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Проверяем права инициатора
                cur.execute("""
                    SELECT role FROM admins WHERE id = %s AND is_active = true
                """, (initiator_id,))
                initiator = cur.fetchone()
                
                if not initiator:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Нет прав доступа'})
                    }
                
                # ПРИВЯЗАТЬ МЕНЕДЖЕРА К ОМ
                if action == 'attach_manager':
                    if initiator['role'] not in ['operational_manager', 'chief_manager', 'superadmin']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Только ОМ/УМ/суперадмин может привязывать менеджеров'})
                        }
                    
                    # Проверяем, что target - менеджер
                    cur.execute("SELECT role FROM admins WHERE id = %s", (target_id,))
                    target = cur.fetchone()
                    if not target or target['role'] != 'manager':
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Целевой пользователь не является менеджером'})
                        }
                    
                    # Проверяем, не привязан ли уже
                    cur.execute("""
                        SELECT operational_manager_id FROM manager_hierarchy WHERE manager_id = %s
                    """, (target_id,))
                    existing = cur.fetchone()
                    
                    if existing and existing['operational_manager_id']:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Менеджер уже привязан к другому ОМ'})
                        }
                    
                    # Привязываем
                    if existing:
                        cur.execute("""
                            UPDATE manager_hierarchy 
                            SET operational_manager_id = %s, updated_at = NOW()
                            WHERE manager_id = %s
                        """, (initiator_id, target_id))
                    else:
                        cur.execute("""
                            INSERT INTO manager_hierarchy (manager_id, operational_manager_id)
                            VALUES (%s, %s)
                        """, (target_id, initiator_id))
                    
                    message = 'Менеджер привязан к ОМ'
                
                # ОТВЯЗАТЬ МЕНЕДЖЕРА ОТ ОМ
                elif action == 'detach_manager':
                    if initiator['role'] not in ['operational_manager', 'chief_manager', 'superadmin']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Нет прав для отвязки менеджера'})
                        }
                    
                    cur.execute("""
                        UPDATE manager_hierarchy 
                        SET operational_manager_id = NULL, updated_at = NOW()
                        WHERE manager_id = %s AND operational_manager_id = %s
                    """, (target_id, initiator_id))
                    
                    if cur.rowcount == 0:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Менеджер не привязан к вам'})
                        }
                    
                    message = 'Менеджер отвязан от ОМ'
                
                # ПРИВЯЗАТЬ ОМ К УМ
                elif action == 'attach_om':
                    if initiator['role'] not in ['chief_manager', 'superadmin']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Только УМ/суперадмин может привязывать ОМ'})
                        }
                    
                    # Проверяем, что target - ОМ
                    cur.execute("SELECT role FROM admins WHERE id = %s", (target_id,))
                    target = cur.fetchone()
                    if not target or target['role'] != 'operational_manager':
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Целевой пользователь не является ОМ'})
                        }
                    
                    # Обновляем всех менеджеров этого ОМ
                    cur.execute("""
                        UPDATE manager_hierarchy 
                        SET chief_manager_id = %s, updated_at = NOW()
                        WHERE operational_manager_id = %s
                    """, (initiator_id, target_id))
                    
                    message = 'ОМ привязан к УМ'
                
                # ОТВЯЗАТЬ ОМ ОТ УМ
                elif action == 'detach_om':
                    if initiator['role'] not in ['chief_manager', 'superadmin']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Нет прав для отвязки ОМ'})
                        }
                    
                    cur.execute("""
                        UPDATE manager_hierarchy 
                        SET chief_manager_id = NULL, updated_at = NOW()
                        WHERE operational_manager_id = %s AND chief_manager_id = %s
                    """, (target_id, initiator_id))
                    
                    message = 'ОМ отвязан от УМ'
                
                else:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неизвестное действие'})
                    }
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': message})
                }
                
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
