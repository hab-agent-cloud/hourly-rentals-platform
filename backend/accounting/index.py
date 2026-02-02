"""API для бухгалтерии - управление заявками на вывод средств"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """Управление заявками на вывод: просмотр, обработка, история"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        
        # GET - получить список заявок и историю
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            action = params.get('action', 'pending')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if action == 'pending':
                    # Получаем активные заявки
                    cur.execute("""
                        SELECT 
                            wr.id, wr.manager_id, wr.amount, wr.withdrawal_method,
                            wr.phone, wr.card_number, wr.recipient_name, wr.bank_name,
                            wr.status, wr.created_at,
                            a.name as manager_name, a.email as manager_email,
                            a.balance as manager_balance
                        FROM withdrawal_requests wr
                        JOIN admins a ON wr.manager_id = a.id
                        WHERE wr.status IN ('pending', 'processing')
                        ORDER BY wr.created_at ASC
                    """)
                    requests = [dict(row) for row in cur.fetchall()]
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'requests': requests}, default=str),
                        'isBase64Encoded': False
                    }
                
                elif action == 'history':
                    # Получаем историю выплат
                    cur.execute("""
                        SELECT 
                            ph.id, ph.manager_id, ph.requested_amount, ph.paid_amount,
                            ph.withdrawal_method, ph.processed_at,
                            m.name as manager_name,
                            p.name as processed_by_name
                        FROM payment_history ph
                        JOIN admins m ON ph.manager_id = m.id
                        LEFT JOIN admins p ON ph.processed_by = p.id
                        ORDER BY ph.processed_at DESC
                        LIMIT 100
                    """)
                    history = [dict(row) for row in cur.fetchall()]
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'history': history}, default=str),
                        'isBase64Encoded': False
                    }
        
        # PUT - обработать заявку (оплатить или отклонить)
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            request_id = body.get('request_id')
            action = body.get('action')  # 'approve' или 'reject'
            paid_amount = body.get('paid_amount')
            admin_id = body.get('admin_id')
            payment_note = body.get('payment_note', '')
            
            if not all([request_id, action, admin_id]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указаны обязательные поля'}),
                    'isBase64Encoded': False
                }
            
            conn.autocommit = False
            
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    # Получаем заявку
                    cur.execute("""
                        SELECT * FROM withdrawal_requests WHERE id = %s AND status = 'pending'
                    """, (request_id,))
                    request = cur.fetchone()
                    
                    if not request:
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Заявка не найдена или уже обработана'}),
                            'isBase64Encoded': False
                        }
                    
                    if action == 'approve':
                        if not paid_amount:
                            return {
                                'statusCode': 400,
                                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                                'body': json.dumps({'error': 'Не указана сумма выплаты'}),
                                'isBase64Encoded': False
                            }
                        
                        # Обновляем заявку
                        cur.execute("""
                            UPDATE withdrawal_requests
                            SET status = 'completed',
                                processed_by = %s,
                                processed_at = NOW(),
                                paid_amount = %s,
                                payment_note = %s,
                                updated_at = NOW()
                            WHERE id = %s
                        """, (admin_id, paid_amount, payment_note, request_id))
                        
                        # Списываем с баланса менеджера
                        cur.execute("""
                            UPDATE admins
                            SET balance = balance - %s
                            WHERE id = %s
                        """, (float(request['amount']), request['manager_id']))
                        
                        # Добавляем в историю
                        cur.execute("""
                            INSERT INTO payment_history 
                                (withdrawal_request_id, manager_id, requested_amount, paid_amount, 
                                 withdrawal_method, processed_by, processed_at)
                            VALUES (%s, %s, %s, %s, %s, %s, NOW())
                        """, (request_id, request['manager_id'], request['amount'], paid_amount, 
                              request['withdrawal_method'], admin_id))
                        
                        message = f'Выплата {paid_amount} ₽ выполнена'
                    
                    elif action == 'reject':
                        # Отклоняем заявку
                        cur.execute("""
                            UPDATE withdrawal_requests
                            SET status = 'rejected',
                                processed_by = %s,
                                processed_at = NOW(),
                                payment_note = %s,
                                updated_at = NOW()
                            WHERE id = %s
                        """, (admin_id, payment_note, request_id))
                        
                        message = 'Заявка отклонена'
                    
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
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
            
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
