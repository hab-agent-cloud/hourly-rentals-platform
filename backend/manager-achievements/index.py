"""API для обработки достижений менеджеров с начислением бонусов"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Проверка и начисление бонусов за достижения"""
    method = event.get('httpMethod', 'POST')
    
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
        admin_id = body.get('admin_id')
        achievement_id = body.get('achievement_id')
        
        if not admin_id or not achievement_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указаны admin_id или achievement_id'}),
                'isBase64Encoded': False
            }
        
        admin_id_int = int(admin_id)
        bonus_amount = 1000
        
        conn = get_db_connection()
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Проверяем, не было ли уже начислено
                cur.execute("""
                    SELECT id FROM t_p39732784_hourly_rentals_platf.achievement_bonuses
                    WHERE admin_id = %s AND achievement_id = %s
                """, (admin_id_int, achievement_id))
                
                if cur.fetchone():
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'message': 'Бонус уже был начислен',
                            'already_awarded': True
                        }),
                        'isBase64Encoded': False
                    }
                
                # Начисляем бонус на баланс
                cur.execute("""
                    UPDATE t_p39732784_hourly_rentals_platf.admins
                    SET balance = balance + %s
                    WHERE id = %s
                    RETURNING balance
                """, (bonus_amount, admin_id_int))
                
                result = cur.fetchone()
                new_balance = float(result['balance']) if result else 0
                
                # Записываем историю начисления
                cur.execute("""
                    INSERT INTO t_p39732784_hourly_rentals_platf.achievement_bonuses
                    (admin_id, achievement_id, amount, created_at)
                    VALUES (%s, %s, %s, NOW())
                """, (admin_id_int, achievement_id, bonus_amount))
                
                # Записываем в историю комиссий для отслеживания
                cur.execute("""
                    INSERT INTO t_p39732784_hourly_rentals_platf.commission_history
                    (admin_id, amount, description, created_at)
                    VALUES (%s, %s, %s, NOW())
                """, (admin_id_int, bonus_amount, f'Бонус за достижение: {achievement_id}'))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'bonus_amount': bonus_amount,
                        'new_balance': new_balance,
                        'message': f'Начислено {bonus_amount}₽ за достижение!'
                    }),
                    'isBase64Encoded': False
                }
                
        finally:
            conn.close()
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
