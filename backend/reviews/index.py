import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для управления отзывами об объектах'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': ''
        }

    db_url = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    try:
        if method == 'GET':
            listing_id = event.get('queryStringParameters', {}).get('listing_id')
            admin_id = event.get('queryStringParameters', {}).get('admin_id')
            
            if listing_id:
                cur.execute(f"""
                    SELECT r.id, r.listing_id, r.client_name, r.rating, r.comment, 
                           r.manager_response, r.responded_at, r.created_at,
                           r.source_url, r.source_site, r.added_by_manager_id,
                           a.name as responder_name
                    FROM {schema}.reviews r
                    LEFT JOIN {schema}.admins a ON r.responded_by = a.id
                    WHERE r.listing_id = %s AND r.is_archived = false
                    ORDER BY r.created_at DESC
                """, (listing_id,))
            elif admin_id:
                cur.execute(f"""
                    SELECT r.id, r.listing_id, r.client_name, r.client_phone, r.rating, 
                           r.comment, r.manager_response, r.responded_at, r.created_at,
                           r.source_url, r.source_site, r.added_by_manager_id,
                           l.title as listing_title, l.city,
                           a.name as responder_name
                    FROM {schema}.reviews r
                    JOIN {schema}.listings l ON r.listing_id = l.id
                    LEFT JOIN {schema}.admins a ON r.responded_by = a.id
                    WHERE r.is_archived = false
                    ORDER BY r.created_at DESC
                """)
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'listing_id or admin_id required'})
                }
            
            columns = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            reviews = [dict(zip(columns, row)) for row in rows]
            
            for review in reviews:
                for key, value in review.items():
                    if isinstance(value, datetime):
                        review[key] = value.isoformat()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'reviews': reviews})
            }

        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            action = data.get('action')
            
            if action == 'create':
                listing_id = data.get('listing_id')
                client_name = data.get('client_name')
                client_phone = data.get('client_phone')
                rating = data.get('rating')
                comment = data.get('comment')
                source_url = data.get('source_url')
                source_site = data.get('source_site')
                added_by_manager_id = data.get('added_by_manager_id')
                review_date = data.get('review_date')
                
                if not all([listing_id, client_name, rating, comment]):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'})
                    }
                
                if review_date:
                    cur.execute(f"""
                        INSERT INTO {schema}.reviews 
                        (listing_id, client_name, client_phone, rating, comment, source_url, source_site, added_by_manager_id, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id
                    """, (listing_id, client_name, client_phone, rating, comment, source_url, source_site, added_by_manager_id, review_date))
                else:
                    cur.execute(f"""
                        INSERT INTO {schema}.reviews 
                        (listing_id, client_name, client_phone, rating, comment, source_url, source_site, added_by_manager_id)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id
                    """, (listing_id, client_name, client_phone, rating, comment, source_url, source_site, added_by_manager_id))
                
                review_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'review_id': review_id})
                }
            
            elif action == 'respond':
                review_id = data.get('review_id')
                manager_response = data.get('manager_response')
                admin_id = data.get('admin_id')
                
                if not all([review_id, manager_response, admin_id]):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'})
                    }
                
                cur.execute(f"""
                    UPDATE {schema}.reviews
                    SET manager_response = %s, responded_by = %s, responded_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (manager_response, admin_id, review_id))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
            
            elif action == 'delete':
                review_id = data.get('review_id')
                admin_id = data.get('admin_id')
                
                if not all([review_id, admin_id]):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'})
                    }
                
                cur.execute(f"DELETE FROM {schema}.reviews WHERE id = %s", (review_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }

            elif action == 'archive':
                review_id = data.get('review_id')
                admin_id = data.get('admin_id')
                
                if not all([review_id, admin_id]):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'})
                    }
                
                cur.execute(f"""
                    UPDATE {schema}.reviews
                    SET is_archived = true, archived_by = %s, archived_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (admin_id, review_id))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
            
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'})
            }

        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
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