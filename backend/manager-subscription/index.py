"""API для управления подписками менеджером"""
import json
import os
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Активация/изменение подписки менеджером с учетом лимитов"""
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
        action = body.get('action')  # 'activate', 'extend', 'reduce'
        listing_id = body.get('listing_id')
        manager_id = body.get('manager_id')
        days = body.get('days', 0)
        
        if not all([action, listing_id, manager_id]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указаны обязательные поля'}),
                'isBase64Encoded': False
            }
        
        manager_id_int = int(manager_id)
        listing_id_int = int(listing_id)
        days_int = int(days)
        
        conn = get_db_connection()
        conn.autocommit = False
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Проверяем права менеджера
                cur.execute(f"""
                    SELECT role, subscription_days_limit 
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
                
                # Проверяем, сопровождает ли менеджер объект
                cur.execute(f"SELECT 1 FROM manager_listings WHERE manager_id = {manager_id_int} AND listing_id = {listing_id_int}")
                if not cur.fetchone() and manager['role'] not in ['superadmin', 'chief_manager', 'operational_manager']:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Вы не сопровождаете этот объект'}),
                        'isBase64Encoded': False
                    }
                
                # АКТИВАЦИЯ подписки
                if action == 'activate':
                    # Проверяем лимит дней
                    if days_int > manager['subscription_days_limit'] and manager['role'] != 'superadmin':
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({
                                'error': f'Превышен лимит дней подписки ({manager["subscription_days_limit"]})'
                            })
                        }
                    
                    # Создаем подписку
                    start_date = datetime.now()
                    end_date = start_date + timedelta(days=days_int)
                    start_str = start_date.strftime('%Y-%m-%d %H:%M:%S')
                    end_str = end_date.strftime('%Y-%m-%d %H:%M:%S')
                    
                    cur.execute(f"""
                        INSERT INTO subscriptions (listing_id, start_date, end_date, created_by, created_by_user_id)
                        VALUES ({listing_id_int}, '{start_str}', '{end_str}', 'manager', {manager_id_int})
                    """)
                    
                    # Логируем
                    details_esc = json.dumps({'days': days_int}).replace("'", "''")
                    cur.execute(f"""
                        INSERT INTO manager_actions_log (manager_id, action_type, listing_id, details)
                        VALUES ({manager_id_int}, 'activate_subscription', {listing_id_int}, '{details_esc}')
                    """)
                    
                    message = f'Подписка активирована на {days_int} дней'
                
                # УМЕНЬШЕНИЕ подписки
                elif action == 'reduce':
                    # Проверяем существующую подписку
                    cur.execute(f"""
                        SELECT id, end_date, created_by 
                        FROM subscriptions 
                        WHERE listing_id = {listing_id_int} AND end_date > NOW()
                        ORDER BY end_date DESC LIMIT 1
                    """)
                    subscription = cur.fetchone()
                    
                    if not subscription:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Нет активной подписки'}),
                            'isBase64Encoded': False
                        }
                    
                    # Проверяем, может ли менеджер изменить подписку
                    if subscription['created_by'] == 'owner' and manager['role'] != 'superadmin':
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({
                                'error': 'Подписка оплачена владельцем. Только суперадмин может её изменить'
                            }),
                            'isBase64Encoded': False
                        }
                    
                    subscription_id_int = int(subscription['id'])
                    
                    # Уменьшаем подписку
                    if days_int == 0:
                        # Удаляем подписку
                        cur.execute(f"UPDATE subscriptions SET end_date = NOW() WHERE id = {subscription_id_int}")
                    else:
                        new_end_date = datetime.now() + timedelta(days=days_int)
                        new_end_str = new_end_date.strftime('%Y-%m-%d %H:%M:%S')
                        cur.execute(f"UPDATE subscriptions SET end_date = '{new_end_str}' WHERE id = {subscription_id_int}")
                    
                    details_esc = json.dumps({'new_days': days_int}).replace("'", "''")
                    cur.execute(f"""
                        INSERT INTO manager_actions_log (manager_id, action_type, listing_id, details)
                        VALUES ({manager_id_int}, 'reduce_subscription', {listing_id_int}, '{details_esc}')
                    """)
                    
                    message = f'Подписка изменена на {days_int} дней'
                
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