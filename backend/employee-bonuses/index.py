import json
import os
import jwt
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def verify_token(token: str) -> dict:
    '''Проверка JWT токена администратора'''
    if not token:
        return None
    try:
        jwt_secret = os.environ['JWT_SECRET']
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return payload
    except:
        return None

def handler(event: dict, context) -> dict:
    '''API для управления выплатами бонусов сотрудникам'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    auth_header = event.get('headers', {}).get('X-Authorization', '')
    token = auth_header.replace('Bearer ', '') if auth_header else ''
    admin = verify_token(token)
    
    if not admin:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            admin_id = event.get('queryStringParameters', {}).get('admin_id')
            show_paid = event.get('queryStringParameters', {}).get('paid') == 'true'
            
            # Получение статистики по всем сотрудникам
            if not admin_id:
                cur.execute("""
                    SELECT 
                        a.id, a.name, a.email,
                        COUNT(b.id) as total_bonuses,
                        SUM(CASE WHEN b.is_paid = FALSE THEN b.bonus_amount ELSE 0 END) as unpaid_amount,
                        SUM(CASE WHEN b.is_paid = TRUE THEN b.bonus_amount ELSE 0 END) as paid_amount,
                        SUM(b.bonus_amount) as total_amount
                    FROM t_p39732784_hourly_rentals_platf.admins a
                    LEFT JOIN t_p39732784_hourly_rentals_platf.employee_bonuses b ON a.id = b.admin_id
                    GROUP BY a.id, a.name, a.email
                    HAVING COUNT(b.id) > 0
                    ORDER BY unpaid_amount DESC
                """)
                stats = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(row) for row in stats], default=str),
                    'isBase64Encoded': False
                }
            
            # Получение бонусов конкретного сотрудника
            else:
                query = """
                    SELECT b.*, a.name as admin_name, p.name as paid_by_name
                    FROM t_p39732784_hourly_rentals_platf.employee_bonuses b
                    LEFT JOIN t_p39732784_hourly_rentals_platf.admins a ON b.admin_id = a.id
                    LEFT JOIN t_p39732784_hourly_rentals_platf.admins p ON b.paid_by_admin_id = p.id
                    WHERE b.admin_id = %s
                """
                
                if not show_paid:
                    query += " AND b.is_paid = FALSE"
                
                query += " ORDER BY b.created_at DESC"
                
                cur.execute(query, (admin_id,))
                bonuses = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(row) for row in bonuses], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'PATCH':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'mark_paid':
                bonus_ids = body.get('bonus_ids', [])
                
                if not bonus_ids:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'bonus_ids обязателен'}),
                        'isBase64Encoded': False
                    }
                
                # Отметить как оплаченные
                placeholders = ','.join(['%s'] * len(bonus_ids))
                cur.execute(f"""
                    UPDATE t_p39732784_hourly_rentals_platf.employee_bonuses
                    SET is_paid = TRUE, paid_at = CURRENT_TIMESTAMP, paid_by_admin_id = %s
                    WHERE id IN ({placeholders})
                    RETURNING id, admin_id, bonus_amount
                """, [admin.get('admin_id')] + bonus_ids)
                
                updated = cur.fetchall()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': f'Оплачено {len(updated)} бонусов',
                        'updated': [dict(row) for row in updated]
                    }, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'mark_unpaid':
                bonus_ids = body.get('bonus_ids', [])
                
                if not bonus_ids:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'bonus_ids обязателен'}),
                        'isBase64Encoded': False
                    }
                
                # Отметить как неоплаченные
                placeholders = ','.join(['%s'] * len(bonus_ids))
                cur.execute(f"""
                    UPDATE t_p39732784_hourly_rentals_platf.employee_bonuses
                    SET is_paid = FALSE, paid_at = NULL, paid_by_admin_id = NULL
                    WHERE id IN ({placeholders})
                    RETURNING id
                """, bonus_ids)
                
                updated = cur.fetchall()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': f'Отменена оплата {len(updated)} бонусов'
                    }, default=str),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unknown action'}),
                    'isBase64Encoded': False
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        print(f'ERROR: {type(e).__name__}: {str(e)}')
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
