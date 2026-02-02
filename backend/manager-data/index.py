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
                cur.execute(f"""
                    SELECT id, name, email, role, balance, manager_level, om_grade,
                           object_limit, subscription_days_limit, commission_percent,
                           bonus_budget, warnings_count
                    FROM admins 
                    WHERE id = {admin_id_int} AND is_active = true
                """)
                admin = cur.fetchone()
                
                if not admin:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Админ не найден'}),
                        'isBase64Encoded': False
                    }
                
                result = dict(admin)
                
                # Получаем иерархию
                cur.execute(f"""
                    SELECT operational_manager_id, chief_manager_id
                    FROM manager_hierarchy
                    WHERE manager_id = {admin_id_int}
                """)
                hierarchy = cur.fetchone()
                
                if hierarchy:
                    result['om_id'] = hierarchy['operational_manager_id']
                    result['um_id'] = hierarchy['chief_manager_id']
                    
                    # Получаем имена ОМ и УМ
                    if hierarchy['operational_manager_id']:
                        om_id = int(hierarchy['operational_manager_id'])
                        cur.execute(f"SELECT name FROM admins WHERE id = {om_id}")
                        om = cur.fetchone()
                        result['om_name'] = om['name'] if om else None
                    
                    if hierarchy['chief_manager_id']:
                        um_id = int(hierarchy['chief_manager_id'])
                        cur.execute(f"SELECT name FROM admins WHERE id = {um_id}")
                        um = cur.fetchone()
                        result['um_name'] = um['name'] if um else None
                
                # Для МЕНЕДЖЕРА
                if admin['role'] == 'manager':
                    # Количество объектов
                    cur.execute(f"""
                        SELECT COUNT(*) as count
                        FROM manager_listings
                        WHERE manager_id = {admin_id_int}
                    """)
                    result['objects_count'] = cur.fetchone()['count']
                    
                    # Список объектов с критичностью
                    cur.execute(f"""
                        SELECT 
                            l.id, l.title as name, l.district, l.status,
                            l.subscription_expires_at as subscription_end,
                            o.first_payment_date,
                            l.photos,
                            CASE 
                                WHEN l.subscription_expires_at < NOW() + INTERVAL '1 day' THEN 'critical'
                                WHEN l.subscription_expires_at < NOW() + INTERVAL '3 days' THEN 'warning'
                                ELSE 'ok'
                            END as urgency,
                            CASE WHEN o.first_payment_date IS NULL THEN true ELSE false END as no_payments
                        FROM manager_listings ml
                        JOIN listings l ON ml.listing_id = l.id
                        LEFT JOIN owners o ON l.owner_id = o.id
                        WHERE ml.manager_id = {admin_id_int}
                        ORDER BY 
                            CASE 
                                WHEN l.subscription_expires_at < NOW() + INTERVAL '1 day' THEN 1
                                WHEN l.subscription_expires_at < NOW() + INTERVAL '3 days' THEN 2
                                ELSE 3
                            END,
                            l.subscription_expires_at ASC
                    """)
                    listings = []
                    for row in cur.fetchall():
                        listing = dict(row)
                        if listing.get('photos'):
                            try:
                                import json as json_module
                                photos = json_module.loads(listing['photos']) if isinstance(listing['photos'], str) else listing['photos']
                                listing['photo'] = photos[0] if photos and len(photos) > 0 else None
                            except:
                                listing['photo'] = None
                        else:
                            listing['photo'] = None
                        listings.append(listing)
                    result['listings'] = listings
                    
                    # Статистика комиссий за месяц
                    cur.execute(f"""
                        SELECT COALESCE(SUM(amount), 0) as month_commission
                        FROM commission_history
                        WHERE admin_id = {admin_id_int} 
                        AND created_at > NOW() - INTERVAL '30 days'
                    """)
                    result['month_commission'] = float(cur.fetchone()['month_commission'])
                    
                    # Задачи от ОМ
                    cur.execute(f"""
                        SELECT id, title, description, deadline, completed
                        FROM manager_tasks
                        WHERE manager_id = {admin_id_int} AND completed = false
                        ORDER BY deadline ASC
                    """)
                    result['tasks'] = [dict(row) for row in cur.fetchall()]
                
                # Для ОМ (Оперативного Менеджера)
                elif admin['role'] == 'operational_manager':
                    # Получаем менеджеров в команде
                    cur.execute(f"""
                        SELECT 
                            a.id, a.name, a.manager_level, a.balance, a.object_limit,
                            a.commission_percent, a.warnings_count,
                            COUNT(ml.id) as objects_count
                        FROM manager_hierarchy mh
                        JOIN admins a ON mh.manager_id = a.id
                        LEFT JOIN manager_listings ml ON a.id = ml.manager_id
                        WHERE mh.operational_manager_id = {admin_id_int}
                        GROUP BY a.id, a.name, a.manager_level, a.balance, a.object_limit, 
                                 a.commission_percent, a.warnings_count
                    """)
                    result['managers'] = [dict(row) for row in cur.fetchall()]
                    result['managers_count'] = len(result['managers'])
                    
                    # Всего объектов команды
                    cur.execute(f"""
                        SELECT COUNT(ml.id) as total_objects
                        FROM manager_hierarchy mh
                        JOIN manager_listings ml ON mh.manager_id = ml.manager_id
                        WHERE mh.operational_manager_id = {admin_id_int}
                    """)
                    result['total_objects'] = cur.fetchone()['total_objects']
                    
                    # Комиссия за месяц
                    cur.execute(f"""
                        SELECT COALESCE(SUM(amount), 0) as month_commission
                        FROM commission_history
                        WHERE admin_id = {admin_id_int} 
                        AND created_at > NOW() - INTERVAL '30 days'
                    """)
                    result['month_commission'] = float(cur.fetchone()['month_commission'])
                
                # Для УМ (Управляющего Менеджера)
                elif admin['role'] == 'chief_manager':
                    # Получаем ОМ в структуре
                    cur.execute(f"""
                        SELECT 
                            a.id, a.name, a.om_grade, a.balance,
                            COUNT(DISTINCT mh2.manager_id) as managers_count
                        FROM manager_hierarchy mh
                        JOIN admins a ON mh.operational_manager_id = a.id
                        LEFT JOIN manager_hierarchy mh2 ON mh2.operational_manager_id = a.id
                        WHERE mh.chief_manager_id = {admin_id_int}
                        GROUP BY a.id, a.name, a.om_grade, a.balance
                    """)
                    result['operational_managers'] = [dict(row) for row in cur.fetchall()]
                    result['om_count'] = len(result['operational_managers'])
                    
                    # Всего менеджеров в структуре
                    cur.execute(f"""
                        SELECT COUNT(DISTINCT manager_id) as total_managers
                        FROM manager_hierarchy
                        WHERE chief_manager_id = {admin_id_int}
                    """)
                    result['total_managers'] = cur.fetchone()['total_managers']
                    
                    # Комиссия за месяц
                    cur.execute(f"""
                        SELECT COALESCE(SUM(amount), 0) as month_commission
                        FROM commission_history
                        WHERE admin_id = {admin_id_int} 
                        AND created_at > NOW() - INTERVAL '30 days'
                    """)
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
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }