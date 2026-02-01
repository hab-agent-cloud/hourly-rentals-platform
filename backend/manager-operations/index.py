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
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO manager_actions_log (manager_id, action_type, listing_id, details)
            VALUES (%s, %s, %s, %s)
        """, (manager_id, action_type, listing_id, json.dumps(details) if details else None))

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
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Получаем данные запроса
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')  # 'take', 'release', 'freeze', 'unfreeze', 'archive'
        listing_id = body.get('listing_id')
        manager_id = body.get('manager_id')
        reason = body.get('reason', '')
        
        if not all([action, listing_id, manager_id]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указаны обязательные поля'})
            }
        
        conn = get_db_connection()
        conn.autocommit = False
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Проверяем права менеджера
                cur.execute("""
                    SELECT role, object_limit, manager_level 
                    FROM admins 
                    WHERE id = %s AND is_active = true
                """, (manager_id,))
                manager = cur.fetchone()
                
                if not manager or manager['role'] not in ['manager', 'operational_manager', 'chief_manager', 'superadmin']:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Нет прав доступа'})
                    }
                
                # Действие: ВЗЯТЬ В СОПРОВОЖДЕНИЕ
                if action == 'take':
                    # Проверяем, свободен ли объект
                    cur.execute("SELECT manager_id FROM manager_listings WHERE listing_id = %s", (listing_id,))
                    existing = cur.fetchone()
                    if existing:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Объект уже занят другим менеджером'})
                        }
                    
                    # Проверяем лимит объектов
                    cur.execute("SELECT COUNT(*) as count FROM manager_listings WHERE manager_id = %s", (manager_id,))
                    current_count = cur.fetchone()['count']
                    if current_count >= manager['object_limit']:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': f'Превышен лимит объектов ({manager["object_limit"]})'})
                        }
                    
                    # Привязываем объект
                    cur.execute("""
                        INSERT INTO manager_listings (manager_id, listing_id)
                        VALUES (%s, %s)
                    """, (manager_id, listing_id))
                    
                    log_action(conn, manager_id, 'take_listing', listing_id, {'reason': reason})
                    message = 'Объект взят в сопровождение'
                
                # Действие: СНЯТЬ С СОПРОВОЖДЕНИЯ
                elif action == 'release':
                    cur.execute("""
                        DELETE FROM manager_listings 
                        WHERE manager_id = %s AND listing_id = %s
                    """, (manager_id, listing_id))
                    if cur.rowcount == 0:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Объект не в вашем сопровождении'})
                        }
                    
                    log_action(conn, manager_id, 'release_listing', listing_id, {'reason': reason})
                    message = 'Объект снят с сопровождения'
                
                # Действие: ЗАМОРОЗИТЬ
                elif action == 'freeze':
                    # Проверяем, что менеджер сопровождает объект
                    cur.execute("SELECT 1 FROM manager_listings WHERE manager_id = %s AND listing_id = %s", (manager_id, listing_id))
                    if not cur.fetchone() and manager['role'] not in ['superadmin', 'chief_manager', 'operational_manager']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Вы не сопровождаете этот объект'})
                        }
                    
                    cur.execute("""
                        UPDATE listings 
                        SET status = 'frozen', frozen_at = NOW()
                        WHERE id = %s
                    """, (listing_id,))
                    
                    log_action(conn, manager_id, 'freeze_listing', listing_id, {'reason': reason})
                    message = 'Объект заморожен'
                
                # Действие: РАЗМОРОЗИТЬ
                elif action == 'unfreeze':
                    cur.execute("SELECT 1 FROM manager_listings WHERE manager_id = %s AND listing_id = %s", (manager_id, listing_id))
                    if not cur.fetchone() and manager['role'] not in ['superadmin', 'chief_manager', 'operational_manager']:
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Вы не сопровождаете этот объект'})
                        }
                    
                    cur.execute("""
                        UPDATE listings 
                        SET status = 'active', frozen_at = NULL
                        WHERE id = %s
                    """, (listing_id,))
                    
                    log_action(conn, manager_id, 'unfreeze_listing', listing_id, {'reason': reason})
                    message = 'Объект разморожен и опубликован'
                
                # Действие: АРХИВИРОВАТЬ
                elif action == 'archive':
                    # Проверяем статус объекта
                    cur.execute("SELECT status FROM listings WHERE id = %s", (listing_id,))
                    listing = cur.fetchone()
                    if not listing or listing['status'] != 'frozen':
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Можно архивировать только замороженные объекты'})
                        }
                    
                    # Проверяем подписку
                    cur.execute("""
                        SELECT end_date FROM subscriptions 
                        WHERE listing_id = %s AND end_date > NOW()
                        ORDER BY end_date DESC LIMIT 1
                    """, (listing_id,))
                    subscription = cur.fetchone()
                    if subscription:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Нельзя архивировать объект с активной подпиской'})
                        }
                    
                    cur.execute("""
                        UPDATE listings 
                        SET status = 'archived', archived_at = NOW(), archive_reason = %s
                        WHERE id = %s
                    """, (reason, listing_id))
                    
                    log_action(conn, manager_id, 'archive_listing', listing_id, {'reason': reason})
                    message = 'Объект перенесен в архив'
                
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
