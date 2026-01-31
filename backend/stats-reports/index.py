"""API для работы с историей отправки статистических отчётов владельцам"""
import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': ''
        }
    
    token = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Токен не предоставлен'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        cur.execute(
            "SELECT id, role FROM t_p39732784_hourly_rentals_platf.admins WHERE token = %s",
            (token,)
        )
        admin = cur.fetchone()
        
        if not admin:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный токен'})
            }
        
        admin_id, admin_role = admin
        
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            listing_id = query_params.get('listing_id')
            
            if listing_id:
                cur.execute("""
                    SELECT sr.id, sr.listing_id, sr.sent_by_admin_id, sr.sent_to_email,
                           sr.report_period_start, sr.report_period_end, sr.stats_data, sr.sent_at,
                           a.name as admin_name, l.title as listing_title
                    FROM t_p39732784_hourly_rentals_platf.stats_reports sr
                    JOIN t_p39732784_hourly_rentals_platf.admins a ON sr.sent_by_admin_id = a.id
                    JOIN t_p39732784_hourly_rentals_platf.listings l ON sr.listing_id = l.id
                    WHERE sr.listing_id = %s
                    ORDER BY sr.sent_at DESC
                    LIMIT 20
                """, (listing_id,))
            else:
                cur.execute("""
                    SELECT sr.id, sr.listing_id, sr.sent_by_admin_id, sr.sent_to_email,
                           sr.report_period_start, sr.report_period_end, sr.stats_data, sr.sent_at,
                           a.name as admin_name, l.title as listing_title
                    FROM t_p39732784_hourly_rentals_platf.stats_reports sr
                    JOIN t_p39732784_hourly_rentals_platf.admins a ON sr.sent_by_admin_id = a.id
                    JOIN t_p39732784_hourly_rentals_platf.listings l ON sr.listing_id = l.id
                    ORDER BY sr.sent_at DESC
                    LIMIT 50
                """)
            
            rows = cur.fetchall()
            reports = []
            for row in rows:
                reports.append({
                    'id': row[0],
                    'listing_id': row[1],
                    'sent_by_admin_id': row[2],
                    'sent_to_email': row[3],
                    'report_period_start': row[4].isoformat() if row[4] else None,
                    'report_period_end': row[5].isoformat() if row[5] else None,
                    'stats_data': row[6],
                    'sent_at': row[7].isoformat() if row[7] else None,
                    'admin_name': row[8],
                    'listing_title': row[9]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'reports': reports})
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            listing_id = body.get('listing_id')
            sent_to_email = body.get('sent_to_email')
            stats_data = body.get('stats_data', {})
            
            if not listing_id or not sent_to_email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указаны обязательные поля'})
                }
            
            period_end = datetime.now()
            period_start = datetime(period_end.year, period_end.month, 1)
            
            cur.execute("""
                INSERT INTO t_p39732784_hourly_rentals_platf.stats_reports 
                (listing_id, sent_by_admin_id, sent_to_email, report_period_start, report_period_end, stats_data)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, sent_at
            """, (listing_id, admin_id, sent_to_email, period_start, period_end, json.dumps(stats_data)))
            
            result = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'report_id': result[0],
                    'sent_at': result[1].isoformat()
                })
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Метод не поддерживается'})
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        cur.close()
        conn.close()
