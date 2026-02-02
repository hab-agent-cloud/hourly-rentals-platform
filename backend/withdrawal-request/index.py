"""API для создания заявок на вывод средств"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """Создание заявки на вывод средств от менеджера"""
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
        manager_id = body.get('manager_id')
        amount = body.get('amount')
        withdrawal_method = body.get('withdrawal_method')
        
        phone = body.get('phone', '')
        card_number = body.get('card_number', '')
        recipient_name = body.get('recipient_name', '')
        bank_name = body.get('bank_name', '')
        
        if not all([manager_id, amount, withdrawal_method]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указаны обязательные поля'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = False
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Проверяем баланс менеджера
                cur.execute("""
                    SELECT balance FROM admins WHERE id = %s AND is_active = true
                """, (manager_id,))
                manager = cur.fetchone()
                
                if not manager:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Менеджер не найден'}),
                        'isBase64Encoded': False
                    }
                
                if float(manager['balance']) < float(amount):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Недостаточно средств на балансе'}),
                        'isBase64Encoded': False
                    }
                
                # Создаём заявку
                cur.execute("""
                    INSERT INTO withdrawal_requests 
                        (manager_id, amount, withdrawal_method, phone, card_number, recipient_name, bank_name, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending')
                    RETURNING id, created_at
                """, (manager_id, amount, withdrawal_method, phone, card_number, recipient_name, bank_name))
                
                result = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'request_id': result['id'],
                        'created_at': str(result['created_at']),
                        'message': 'Заявка на вывод создана'
                    }, default=str),
                    'isBase64Encoded': False
                }
                
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
            
    except Exception as e:
        import traceback
        print(f"[ERROR] {str(e)}")
        print(f"[TRACEBACK] {traceback.format_exc()}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
