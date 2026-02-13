import json
import os
import psycopg2
import psycopg2.extras

SCHEMA = 't_p39732784_hourly_rentals_platf'

def handler(event, context):
    '''Получение списка владельцев для менеджера (свои) или ОМ/УМ/суперадмин (все)'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
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
    
    params = event.get('queryStringParameters') or {}
    admin_id = params.get('admin_id')
    
    if not admin_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'admin_id обязателен'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    try:
        cur.execute(f"SELECT id, role FROM {SCHEMA}.admins WHERE id = %s", (admin_id,))
        admin = cur.fetchone()
        
        if not admin:
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Доступ запрещён'}),
                'isBase64Encoded': False
            }
        
        role = admin['role']
        
        if role in ('om', 'um', 'superadmin'):
            cur.execute(f"""
                SELECT o.id, o.full_name, o.phone, o.email, o.username, o.telegram_name,
                       o.manager_comment, o.created_at, o.last_login, o.balance, o.bonus_balance,
                       o.is_archived, o.created_by_manager_id,
                       a.name as manager_name,
                       COUNT(l.id) as listings_count
                FROM {SCHEMA}.owners o
                LEFT JOIN {SCHEMA}.admins a ON a.id = o.created_by_manager_id
                LEFT JOIN {SCHEMA}.listings l ON l.owner_id = o.id AND l.is_archived = false
                GROUP BY o.id, o.full_name, o.phone, o.email, o.username, o.telegram_name,
                         o.manager_comment, o.created_at, o.last_login, o.balance, o.bonus_balance,
                         o.is_archived, o.created_by_manager_id, a.name
                ORDER BY o.created_at DESC
            """)
        else:
            cur.execute(f"""
                SELECT o.id, o.full_name, o.phone, o.email, o.username, o.telegram_name,
                       o.manager_comment, o.created_at, o.last_login, o.balance, o.bonus_balance,
                       o.is_archived, o.created_by_manager_id,
                       NULL as manager_name,
                       COUNT(l.id) as listings_count
                FROM {SCHEMA}.owners o
                LEFT JOIN {SCHEMA}.listings l ON l.owner_id = o.id AND l.is_archived = false
                WHERE o.created_by_manager_id = %s
                GROUP BY o.id, o.full_name, o.phone, o.email, o.username, o.telegram_name,
                         o.manager_comment, o.created_at, o.last_login, o.balance, o.bonus_balance,
                         o.is_archived, o.created_by_manager_id
                ORDER BY o.created_at DESC
            """, (admin_id,))
        
        owners = cur.fetchall()
        
        result = []
        for o in owners:
            result.append({
                'id': o['id'],
                'full_name': o['full_name'],
                'phone': o['phone'],
                'email': o['email'],
                'username': o['username'],
                'telegram_name': o['telegram_name'],
                'manager_comment': o['manager_comment'],
                'created_at': o['created_at'].isoformat() if o['created_at'] else None,
                'last_login': o['last_login'].isoformat() if o['last_login'] else None,
                'balance': float(o['balance'] or 0),
                'bonus_balance': float(o['bonus_balance'] or 0),
                'is_archived': o['is_archived'],
                'created_by_manager_id': o['created_by_manager_id'],
                'manager_name': o['manager_name'],
                'listings_count': o['listings_count']
            })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'owners': result, 'total': len(result), 'role': role}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
