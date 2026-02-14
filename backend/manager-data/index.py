"""API для получения данных менеджера, ОМ, УМ"""
import json
import os
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Получение данных для личного кабинета менеджера/ОМ/УМ"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        params = event.get('queryStringParameters', {}) or {}
        admin_id = params.get('admin_id')
        
        if not admin_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указан admin_id'}),
                'isBase64Encoded': False
            }
        
        admin_id_int = int(admin_id)
        
        conn = get_db_connection()
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Получаем данные админа
                cur.execute("""
                    SELECT id, name, email, role, balance, manager_level, om_grade,
                           object_limit, subscription_days_limit, commission_percent,
                           bonus_budget, warnings_count, copywriter_earnings
                    FROM t_p39732784_hourly_rentals_platf.admins 
                    WHERE id = %s AND is_active = true
                """, (admin_id_int,))
                admin = cur.fetchone()
                
                if not admin:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Админ не найден'}),
                        'isBase64Encoded': False
                    }
                
                result = dict(admin)
                
                # Получаем реальный заработок копирайтера из employee_bonuses
                cur.execute("""
                    SELECT COALESCE(SUM(bonus_amount), 0) as total_copywriter_earnings
                    FROM t_p39732784_hourly_rentals_platf.employee_bonuses
                    WHERE admin_id = %s
                """, (admin_id_int,))
                earnings_row = cur.fetchone()
                result['copywriter_earnings'] = float(earnings_row['total_copywriter_earnings']) if earnings_row else 0
                
                # Получаем иерархию
                cur.execute("""
                    SELECT operational_manager_id, chief_manager_id
                    FROM t_p39732784_hourly_rentals_platf.manager_hierarchy
                    WHERE manager_id = %s
                """, (admin_id_int,))
                hierarchy = cur.fetchone()
                
                if hierarchy:
                    result['om_id'] = hierarchy['operational_manager_id']
                    result['um_id'] = hierarchy['chief_manager_id']
                    
                    # Получаем имена ОМ и УМ
                    if hierarchy['operational_manager_id']:
                        om_id = int(hierarchy['operational_manager_id'])
                        cur.execute("SELECT name FROM t_p39732784_hourly_rentals_platf.admins WHERE id = %s", (om_id,))
                        om = cur.fetchone()
                        result['om_name'] = om['name'] if om else None
                    
                    if hierarchy['chief_manager_id']:
                        um_id = int(hierarchy['chief_manager_id'])
                        cur.execute("SELECT name FROM t_p39732784_hourly_rentals_platf.admins WHERE id = %s", (um_id,))
                        um = cur.fetchone()
                        result['um_name'] = um['name'] if um else None
                
                # Для МЕНЕДЖЕРА
                if admin['role'] == 'manager':
                    # Количество объектов
                    cur.execute("""
                        SELECT COUNT(*) as count
                        FROM t_p39732784_hourly_rentals_platf.manager_listings
                        WHERE manager_id = %s
                    """, (admin_id_int,))
                    result['objects_count'] = cur.fetchone()['count']
                    
                    # Статистика активности за неделю
                    cur.execute("""
                        SELECT COUNT(*) as completed_tasks
                        FROM t_p39732784_hourly_rentals_platf.manager_tasks
                        WHERE manager_id = %s 
                        AND completed = true
                        AND completed_at > NOW() - INTERVAL '7 days'
                    """, (admin_id_int,))
                    result['week_tasks_completed'] = cur.fetchone()['completed_tasks']
                    
                    # Рейтинг среди менеджеров (по количеству объектов)
                    cur.execute("""
                        WITH manager_stats AS (
                            SELECT 
                                manager_id,
                                COUNT(*) as obj_count,
                                RANK() OVER (ORDER BY COUNT(*) DESC) as rank
                            FROM t_p39732784_hourly_rentals_platf.manager_listings
                            GROUP BY manager_id
                        )
                        SELECT rank, obj_count
                        FROM manager_stats
                        WHERE manager_id = %s
                    """, (admin_id_int,))
                    rating_row = cur.fetchone()
                    result['manager_rank'] = int(rating_row['rank']) if rating_row else None
                    result['rank_objects'] = int(rating_row['obj_count']) if rating_row else 0
                    
                    # Список активных объектов с критичностью
                    cur.execute("""
                        SELECT 
                            l.id, l.title as name, l.district, l.status,
                            l.subscription_expires_at as subscription_end,
                            l.image_url as photo,
                            l.phone as owner_phone,
                            CASE 
                                WHEN l.subscription_expires_at < NOW() + INTERVAL '1 day' THEN 'critical'
                                WHEN l.subscription_expires_at < NOW() + INTERVAL '3 days' THEN 'warning'
                                ELSE 'ok'
                            END as urgency,
                            CASE WHEN l.owner_id IS NULL THEN true ELSE false END as no_payments
                        FROM t_p39732784_hourly_rentals_platf.manager_listings ml
                        JOIN t_p39732784_hourly_rentals_platf.listings l ON ml.listing_id = l.id
                        WHERE ml.manager_id = %s AND l.status != 'inactive'
                        ORDER BY 
                            CASE 
                                WHEN l.subscription_expires_at < NOW() + INTERVAL '1 day' THEN 1
                                WHEN l.subscription_expires_at < NOW() + INTERVAL '3 days' THEN 2
                                ELSE 3
                            END,
                            l.subscription_expires_at ASC
                    """, (admin_id_int,))
                    result['listings'] = [dict(row) for row in cur.fetchall()]
                    
                    # Список неактивных объектов
                    cur.execute("""
                        SELECT 
                            l.id, l.title as name, l.district, l.status,
                            l.image_url as photo,
                            l.phone as owner_phone,
                            l.inactive_at,
                            l.inactive_reason
                        FROM t_p39732784_hourly_rentals_platf.manager_listings ml
                        JOIN t_p39732784_hourly_rentals_platf.listings l ON ml.listing_id = l.id
                        WHERE ml.manager_id = %s AND l.status = 'inactive'
                        ORDER BY l.inactive_at DESC
                    """, (admin_id_int,))
                    result['inactive_listings'] = [dict(row) for row in cur.fetchall()]
                    
                    # Статистика комиссий за месяц
                    cur.execute("""
                        SELECT COALESCE(SUM(amount), 0) as month_commission
                        FROM t_p39732784_hourly_rentals_platf.commission_history
                        WHERE admin_id = %s 
                        AND created_at > NOW() - INTERVAL '30 days'
                    """, (admin_id_int,))
                    result['month_commission'] = float(cur.fetchone()['month_commission'])
                    
                    # Общая сумма пополнений владельцев по объектам менеджера
                    cur.execute("""
                        SELECT COALESCE(SUM(t.amount), 0) as total_owner_payments
                        FROM t_p39732784_hourly_rentals_platf.manager_listings ml
                        JOIN t_p39732784_hourly_rentals_platf.listings l ON ml.listing_id = l.id
                        JOIN t_p39732784_hourly_rentals_platf.transactions t ON l.owner_id = t.owner_id
                        WHERE ml.manager_id = %s 
                        AND t.type = 'payment'
                        AND t.amount > 0
                    """, (admin_id_int,))
                    result['total_owner_payments'] = float(cur.fetchone()['total_owner_payments'])
                    
                    # Дублируем objects_count как total_listings для блока достижений на дашборде
                    result['total_listings'] = result['objects_count']
                    
                    # Общий заработок менеджера за всё время (все комиссии)
                    cur.execute("""
                        SELECT COALESCE(SUM(amount), 0) as total_earned
                        FROM t_p39732784_hourly_rentals_platf.commission_history
                        WHERE admin_id = %s
                    """, (admin_id_int,))
                    result['total_earned'] = float(cur.fetchone()['total_earned'])
                    
                    # Задачи от ОМ
                    cur.execute("""
                        SELECT id, title, description, deadline, completed
                        FROM t_p39732784_hourly_rentals_platf.manager_tasks
                        WHERE manager_id = %s AND completed = false
                        ORDER BY deadline ASC
                    """, (admin_id_int,))
                    result['tasks'] = [dict(row) for row in cur.fetchall()]
                
                # Для ОМ (Оперативного Менеджера)
                elif admin['role'] == 'operational_manager':
                    # Получаем менеджеров в команде
                    cur.execute("""
                        SELECT 
                            a.id, a.name, a.manager_level, a.balance, a.object_limit,
                            a.commission_percent, a.warnings_count,
                            COUNT(ml.id) as objects_count
                        FROM t_p39732784_hourly_rentals_platf.manager_hierarchy mh
                        JOIN t_p39732784_hourly_rentals_platf.admins a ON mh.manager_id = a.id
                        LEFT JOIN t_p39732784_hourly_rentals_platf.manager_listings ml ON a.id = ml.manager_id
                        WHERE mh.operational_manager_id = %s
                        GROUP BY a.id, a.name, a.manager_level, a.balance, a.object_limit, 
                                 a.commission_percent, a.warnings_count
                    """, (admin_id_int,))
                    result['managers'] = [dict(row) for row in cur.fetchall()]
                    result['managers_count'] = len(result['managers'])
                    
                    # Всего объектов команды
                    cur.execute("""
                        SELECT COUNT(ml.id) as total_objects
                        FROM t_p39732784_hourly_rentals_platf.manager_hierarchy mh
                        JOIN t_p39732784_hourly_rentals_platf.manager_listings ml ON mh.manager_id = ml.manager_id
                        WHERE mh.operational_manager_id = %s
                    """, (admin_id_int,))
                    result['total_objects'] = cur.fetchone()['total_objects']
                    
                    # Комиссия за месяц
                    cur.execute("""
                        SELECT COALESCE(SUM(amount), 0) as month_commission
                        FROM t_p39732784_hourly_rentals_platf.commission_history
                        WHERE admin_id = %s 
                        AND created_at > NOW() - INTERVAL '30 days'
                    """, (admin_id_int,))
                    result['month_commission'] = float(cur.fetchone()['month_commission'])
                    
                    # Статистика активности команды за неделю
                    cur.execute("""
                        SELECT COALESCE(SUM(completed_count), 0) as week_tasks_completed
                        FROM (
                            SELECT COUNT(*) as completed_count
                            FROM t_p39732784_hourly_rentals_platf.manager_tasks mt
                            JOIN t_p39732784_hourly_rentals_platf.manager_hierarchy mh 
                                ON mt.manager_id = mh.manager_id
                            WHERE mh.operational_manager_id = %s
                            AND mt.completed = true
                            AND mt.completed_at > NOW() - INTERVAL '7 days'
                        ) t
                    """, (admin_id_int,))
                    result['week_tasks_completed'] = cur.fetchone()['week_tasks_completed']
                    
                    # Рейтинг ОМ по количеству объектов команды
                    cur.execute("""
                        WITH om_stats AS (
                            SELECT 
                                mh.operational_manager_id as om_id,
                                COUNT(ml.id) as obj_count,
                                RANK() OVER (ORDER BY COUNT(ml.id) DESC) as rank
                            FROM t_p39732784_hourly_rentals_platf.manager_hierarchy mh
                            JOIN t_p39732784_hourly_rentals_platf.manager_listings ml ON mh.manager_id = ml.manager_id
                            WHERE mh.operational_manager_id IS NOT NULL
                            GROUP BY mh.operational_manager_id
                        )
                        SELECT rank, obj_count
                        FROM om_stats
                        WHERE om_id = %s
                    """, (admin_id_int,))
                    rating_row = cur.fetchone()
                    result['om_rank'] = int(rating_row['rank']) if rating_row else None
                    result['rank_objects'] = int(rating_row['obj_count']) if rating_row else 0
                    
                    # total_listings для ОМ = total_objects
                    result['total_listings'] = result.get('total_objects', 0)
                    
                    # Общий заработок ОМ за всё время
                    cur.execute("""
                        SELECT COALESCE(SUM(amount), 0) as total_earned
                        FROM t_p39732784_hourly_rentals_platf.commission_history
                        WHERE admin_id = %s
                    """, (admin_id_int,))
                    result['total_earned'] = float(cur.fetchone()['total_earned'])
                
                # Для УМ (Управляющего Менеджера)
                elif admin['role'] == 'chief_manager':
                    # Получаем ОМ в структуре
                    cur.execute("""
                        SELECT 
                            a.id, a.name, a.om_grade, a.balance,
                            COUNT(DISTINCT mh2.manager_id) as managers_count
                        FROM t_p39732784_hourly_rentals_platf.manager_hierarchy mh
                        JOIN t_p39732784_hourly_rentals_platf.admins a ON mh.operational_manager_id = a.id
                        LEFT JOIN t_p39732784_hourly_rentals_platf.manager_hierarchy mh2 ON mh2.operational_manager_id = a.id
                        WHERE mh.chief_manager_id = %s
                        GROUP BY a.id, a.name, a.om_grade, a.balance
                    """, (admin_id_int,))
                    result['operational_managers'] = [dict(row) for row in cur.fetchall()]
                    result['om_count'] = len(result['operational_managers'])
                    
                    # Всего менеджеров в структуре
                    cur.execute("""
                        SELECT COUNT(DISTINCT manager_id) as total_managers
                        FROM t_p39732784_hourly_rentals_platf.manager_hierarchy
                        WHERE chief_manager_id = %s
                    """, (admin_id_int,))
                    result['total_managers'] = cur.fetchone()['total_managers']
                    
                    # Комиссия за месяц
                    cur.execute("""
                        SELECT COALESCE(SUM(amount), 0) as month_commission
                        FROM t_p39732784_hourly_rentals_platf.commission_history
                        WHERE admin_id = %s 
                        AND created_at > NOW() - INTERVAL '30 days'
                    """, (admin_id_int,))
                    result['month_commission'] = float(cur.fetchone()['month_commission'])
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result, default=str),
                    'isBase64Encoded': False
                }
                
        finally:
            conn.close()
            
    except ValueError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный формат admin_id'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        import traceback
        print(f"[ERROR] {str(e)}")
        print(f"[TRACEBACK] {traceback.format_exc()}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e), 'trace': traceback.format_exc()}),
            'isBase64Encoded': False
        }