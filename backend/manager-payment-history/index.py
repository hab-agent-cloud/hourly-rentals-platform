"""API для получения истории выплат менеджера"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """Получение истории выплат и активных заявок менеджера"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        params = event.get('queryStringParameters', {}) or {}
        manager_id = params.get('manager_id')
        
        if not manager_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указан manager_id'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Получаем активные заявки
                cur.execute("""
                    SELECT 
                        id, amount, withdrawal_method, status, created_at
                    FROM withdrawal_requests
                    WHERE manager_id = %s AND status IN ('pending', 'processing')
                    ORDER BY created_at DESC
                """, (manager_id,))
                active_requests = [dict(row) for row in cur.fetchall()]
                
                # Получаем историю выплат
                cur.execute("""
                    SELECT 
                        ph.id, ph.requested_amount, ph.paid_amount,
                        ph.withdrawal_method, ph.processed_at,
                        p.name as processed_by_name
                    FROM payment_history ph
                    LEFT JOIN admins p ON ph.processed_by = p.id
                    WHERE ph.manager_id = %s
                    ORDER BY ph.processed_at DESC
                    LIMIT 50
                """, (manager_id,))
                history = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'active_requests': active_requests,
                        'history': history
                    }, default=str),
                    'isBase64Encoded': False
                }
                
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
