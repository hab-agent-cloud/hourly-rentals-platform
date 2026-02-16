"""API для операций менеджера с объектами"""
import json
import os
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Подключение к БД"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def log_action(conn, manager_id: int, action_type: str, listing_id: int = None, details: dict = None):
    """Логирование действий менеджера"""
    manager_id_int = int(manager_id)
    action_type_esc = action_type.replace("'", "''")
    
    with conn.cursor() as cur:
        if listing_id is not None and details is not None:
            listing_id_int = int(listing_id)
            details_esc = json.dumps(details).replace("'", "''")
            cur.execute(f"""
                INSERT INTO manager_actions_log (manager_id, action_type, listing_id, details)
                VALUES ({manager_id_int}, '{action_type_esc}', {listing_id_int}, '{details_esc}')
            """)
        elif listing_id is not None:
            listing_id_int = int(listing_id)
            cur.execute(f"""
                INSERT INTO manager_actions_log (manager_id, action_type, listing_id, details)
                VALUES ({manager_id_int}, '{action_type_esc}', {listing_id_int}, NULL)
            """)
        elif details is not None:
            details_esc = json.dumps(details).replace("'", "''")
            cur.execute(f"""
                INSERT INTO manager_actions_log (manager_id, action_type, listing_id, details)
                VALUES ({manager_id_int}, '{action_type_esc}', NULL, '{details_esc}')
            """)
        else:
            cur.execute(f"""
                INSERT INTO manager_actions_log (manager_id, action_type, listing_id, details)
                VALUES ({manager_id_int}, '{action_type_esc}', NULL, NULL)
            """)

def handler(event: dict, context) -> dict:
    """
    API для управления объектами менеджером:
    - Взять/снять объект с сопровождения
    - Заморозить/разморозить объект
    - Перенести в архив
    """
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
        # Получаем данные запроса
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')  # 'take', 'release', 'freeze', 'unfreeze', 'archive', 'reset_subscription'
        listing_id = body.get('listing_id')
        manager_id = body.get('manager_id')
        reason = body.get('reason', '')
        
        if not all([action, listing_id, manager_id]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указаны обязательные поля'}),
                'isBase64Encoded': False
            }
        
        manager_id_int = int(manager_id)
        listing_id_int = int(listing_id)
        reason_esc = reason.replace("'", "''")
        
        conn = get_db_connection()
        conn.autocommit = False
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Проверяем права менеджера
                cur.execute(f"""
                    SELECT role, object_limit, manager_level 
                    FROM admins 
                    WHERE id = {manager_id_int} AND is_active = true
                """)
                manager = cur.fetchone()
                
                if not manager or manager['role'] not in ['manager', 'operational_manager', 'chief_manager', 'superadmin']:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Нет прав доступа'}),
                        'isBase64Encoded': False
                    }
                
                # Действие: ВЗЯТЬ В СОПРОВОЖДЕНИЕ
                if action == 'take':
                    # Проверяем, свободен ли объект
                    cur.execute(f"SELECT manager_id FROM manager_listings WHERE listing_id = {listing_id_int}")
                    existing = cur.fetchone()
                    if existing:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Объект уже занят другим менеджером'}),
                            'isBase64Encoded': False
                        }
                    
                    # Проверяем лимит объектов
                    cur.execute(f"SELECT COUNT(*) as count FROM manager_listings WHERE manager_id = {manager_id_int}")
                    current_count = cur.fetchone()['count']
                    if current_count >= manager['object_limit']:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': f'Превышен лимит объектов ({manager["object_limit"]})'})
                        }
                    
                    # Привязываем объект
                    cur.execute(f"""
                        INSERT INTO manager_listings (manager_id, listing_id)
                        VALUES ({manager_id_int}, {listing_id_int})
                    """)
                    
                    log_action(conn, manager_id_int, 'take_listing', listing_id_int, {'reason': reason})
                    message = 'Объект взят в сопровождение'
                
                # Действие: СНЯТЬ С СОПРОВОЖДЕНИЯ
                elif action == 'release':
                    cur.execute(f"""
                        DELETE FROM manager_listings 
                        WHERE manager_id = {manager_id_int} AND listing_id = {listing_id_int}
                    """)
                    if cur.rowcount == 0:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Объект не в вашем сопровождении'}),
                            'isBase64Encoded': False
                        }
                    
                    log_action(conn, manager_id_int, 'release_listing', listing_id_int, {'reason': reason})
                    message = 'Объект снят с сопровождения'
                
                # Действие: ЗАМОРОЗИТЬ
                elif action == 'freeze':
                    # Проверяем, что менеджер сопровождает объект
                    cur.execute(f"SELECT 1 FROM manager_listings WHERE manager_id = {manager_id_int} AND listing_id = {listing_id_int}")
                    if not cur.fetchone() and manager['role'] not in ['superadmin', 'chief_manager', 'operational_manager']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Вы не сопровождаете этот объект'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(f"""
                        UPDATE listings 
                        SET status = 'frozen', frozen_at = NOW()
                        WHERE id = {listing_id_int}
                    """)
                    
                    log_action(conn, manager_id_int, 'freeze_listing', listing_id_int, {'reason': reason})
                    message = 'Объект заморожен'
                
                # Действие: УБРАТЬ В НЕАКТИВНЫЕ
                elif action == 'deactivate':
                    cur.execute(f"SELECT 1 FROM manager_listings WHERE manager_id = {manager_id_int} AND listing_id = {listing_id_int}")
                    if not cur.fetchone() and manager['role'] not in ['superadmin', 'chief_manager', 'operational_manager']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Вы не сопровождаете этот объект'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(f"""
                        UPDATE listings 
                        SET status = 'inactive', inactive_at = NOW(), inactive_reason = '{reason_esc}'
                        WHERE id = {listing_id_int}
                    """)
                    
                    cur.execute(f"""
                        DELETE FROM manager_listings 
                        WHERE listing_id = {listing_id_int}
                    """)
                    
                    log_action(conn, manager_id_int, 'deactivate_listing', listing_id_int, {'reason': reason})
                    message = 'Объект перемещён в неактивные и отвязан от менеджера'
                
                # Действие: РАЗМОРОЗИТЬ
                elif action == 'unfreeze':
                    cur.execute(f"SELECT 1 FROM manager_listings WHERE manager_id = {manager_id_int} AND listing_id = {listing_id_int}")
                    if not cur.fetchone() and manager['role'] not in ['superadmin', 'chief_manager', 'operational_manager']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Вы не сопровождаете этот объект'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(f"""
                        UPDATE listings 
                        SET status = 'active', frozen_at = NULL
                        WHERE id = {listing_id_int}
                    """)
                    
                    log_action(conn, manager_id_int, 'unfreeze_listing', listing_id_int, {'reason': reason})
                    message = 'Объект разморожен и опубликован'
                
                # Действие: АКТИВИРОВАТЬ (вернуть из неактивных)
                elif action == 'activate':
                    cur.execute(f"SELECT 1 FROM manager_listings WHERE manager_id = {manager_id_int} AND listing_id = {listing_id_int}")
                    if not cur.fetchone() and manager['role'] not in ['superadmin', 'chief_manager', 'operational_manager']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Вы не сопровождаете этот объект'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(f"""
                        UPDATE listings 
                        SET status = 'active', inactive_at = NULL, inactive_reason = NULL
                        WHERE id = {listing_id_int}
                    """)
                    
                    log_action(conn, manager_id_int, 'activate_listing', listing_id_int, {'reason': reason})
                    message = 'Объект возвращён в работу'
                
                # Действие: АРХИВИРОВАТЬ
                elif action == 'archive':
                    # Проверяем статус объекта
                    cur.execute(f"SELECT status FROM listings WHERE id = {listing_id_int}")
                    listing = cur.fetchone()
                    if not listing or listing['status'] != 'frozen':
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Можно архивировать только замороженные объекты'}),
                            'isBase64Encoded': False
                        }
                    
                    # Проверяем подписку
                    cur.execute(f"""
                        SELECT end_date FROM subscriptions 
                        WHERE listing_id = {listing_id_int} AND end_date > NOW()
                        ORDER BY end_date DESC LIMIT 1
                    """)
                    active_sub = cur.fetchone()
                    if active_sub:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Нельзя архивировать объект с активной подпиской'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(f"""
                        UPDATE listings 
                        SET status = 'archived', archived_at = NOW()
                        WHERE id = {listing_id_int}
                    """)
                    
                    # Снимаем привязку менеджера
                    cur.execute(f"DELETE FROM manager_listings WHERE listing_id = {listing_id_int}")
                    
                    log_action(conn, manager_id_int, 'archive_listing', listing_id_int, {'reason': reason})
                    message = 'Объект перенесен в архив'
                
                # Действие: ОБНУЛИТЬ ПОДПИСКУ
                elif action == 'reset_subscription':
                    cur.execute(f"SELECT id, subscription_expires_at FROM listings WHERE id = {listing_id_int}")
                    listing_row = cur.fetchone()
                    if not listing_row:
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Объект не найден'}),
                            'isBase64Encoded': False
                        }
                    
                    has_active_sub = listing_row['subscription_expires_at'] and listing_row['subscription_expires_at'] > datetime.now()
                    if not has_active_sub:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'У объекта нет активной подписки'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(f"""
                        SELECT id, created_by FROM subscriptions 
                        WHERE listing_id = {listing_id_int} AND end_date > NOW()
                        ORDER BY end_date DESC LIMIT 1
                    """)
                    active_sub = cur.fetchone()
                    
                    if active_sub and active_sub['created_by'] == 'owner':
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Нельзя обнулить подписку, купленную владельцем'}),
                            'isBase64Encoded': False
                        }
                    
                    if active_sub:
                        cur.execute(f"""
                            UPDATE subscriptions 
                            SET end_date = NOW() - INTERVAL '1 day'
                            WHERE listing_id = {listing_id_int} AND end_date > NOW()
                        """)
                    
                    cur.execute(f"""
                        UPDATE listings 
                        SET subscription_expires_at = NULL
                        WHERE id = {listing_id_int}
                    """)
                    
                    log_action(conn, manager_id_int, 'reset_subscription', listing_id_int, {'reason': 'Обнуление подписки менеджером'})
                    message = 'Подписка обнулена'
                
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