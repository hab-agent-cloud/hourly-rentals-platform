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
        action = body.get('action')  # 'activate', 'extend', 'reduce'
        listing_id = body.get('listing_id')
        manager_id = body.get('manager_id')
        days = body.get('days', 0)
        
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
                    SELECT role, subscription_days_limit 
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
                
                # Проверяем, сопровождает ли менеджер объект
                cur.execute("SELECT 1 FROM manager_listings WHERE manager_id = %s AND listing_id = %s", (manager_id, listing_id))
                if not cur.fetchone() and manager['role'] not in ['superadmin', 'chief_manager', 'operational_manager']:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Вы не сопровождаете этот объект'})
                    }
                
                # АКТИВАЦИЯ подписки
                if action == 'activate':
                    # Проверяем лимит дней
                    if days > manager['subscription_days_limit'] and manager['role'] != 'superadmin':
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({
                                'error': f'Превышен лимит дней подписки ({manager["subscription_days_limit"]})'
                            })
                        }
                    
                    # Создаем подписку
                    start_date = datetime.now()
                    end_date = start_date + timedelta(days=days)
                    
                    cur.execute("""
                        INSERT INTO subscriptions (listing_id, start_date, end_date, created_by, created_by_user_id)
                        VALUES (%s, %s, %s, 'manager', %s)
                    """, (listing_id, start_date, end_date, manager_id))
                    
                    # Логируем
                    cur.execute("""
                        INSERT INTO manager_actions_log (manager_id, action_type, listing_id, details)
                        VALUES (%s, 'activate_subscription', %s, %s)
                    """, (manager_id, listing_id, json.dumps({'days': days})))
                    
                    message = f'Подписка активирована на {days} дней'
                
                # УМЕНЬШЕНИЕ подписки
                elif action == 'reduce':
                    # Проверяем существующую подписку
                    cur.execute("""
                        SELECT id, end_date, created_by 
                        FROM subscriptions 
                        WHERE listing_id = %s AND end_date > NOW()
                        ORDER BY end_date DESC LIMIT 1
                    """, (listing_id,))
                    subscription = cur.fetchone()
                    
                    if not subscription:
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Нет активной подписки'})
                        }
                    
                    # Проверяем, может ли менеджер изменить подписку
                    if subscription['created_by'] == 'owner' and manager['role'] != 'superadmin':
                        return {
                            'statusCode': 403,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({
                                'error': 'Подписка оплачена владельцем. Только суперадмин может её изменить'
                            })
                        }
                    
                    # Уменьшаем подписку
                    if days == 0:
                        # Удаляем подписку
                        cur.execute("UPDATE subscriptions SET end_date = NOW() WHERE id = %s", (subscription['id'],))
                    else:
                        new_end_date = datetime.now() + timedelta(days=days)
                        cur.execute("UPDATE subscriptions SET end_date = %s WHERE id = %s", (new_end_date, subscription['id']))
                    
                    cur.execute("""
                        INSERT INTO manager_actions_log (manager_id, action_type, listing_id, details)
                        VALUES (%s, 'reduce_subscription', %s, %s)
                    """, (manager_id, listing_id, json.dumps({'new_days': days})))
                    
                    message = f'Подписка изменена на {days} дней'
                
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
