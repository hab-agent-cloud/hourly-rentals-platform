import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''Автоматическая архивация объектов с истекшей подпиской.
    Если объект не привязан к менеджеру — подписка продлевается на 30 дней автоматически.
    Если привязан к менеджеру — объект архивируется.'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Найти все объекты с истекшей подпиской
        cur.execute("""
            SELECT 
                l.id, 
                l.title, 
                l.subscription_expires_at,
                ml.manager_id
            FROM listings l
            LEFT JOIN manager_listings ml ON ml.listing_id = l.id
            WHERE l.is_archived = FALSE 
            AND l.subscription_expires_at IS NOT NULL
            AND l.subscription_expires_at < NOW()
        """)
        
        expired_listings = cur.fetchall()
        
        if not expired_listings:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Нет объектов с истекшей подпиской',
                    'archived_count': 0,
                    'renewed_count': 0
                }),
                'isBase64Encoded': False
            }
        
        # Разделить на две группы
        to_archive = [l for l in expired_listings if l['manager_id'] is not None]
        to_renew = [l for l in expired_listings if l['manager_id'] is None]
        
        archived_titles = []
        renewed_titles = []

        # Архивировать объекты с менеджером
        if to_archive:
            archive_ids = [l['id'] for l in to_archive]
            cur.execute("""
                UPDATE listings 
                SET is_archived = TRUE
                WHERE id = ANY(%s)
            """, (archive_ids,))
            archived_titles = [l['title'] for l in to_archive]
        
        # Продлить подписку на 30 дней для объектов без менеджера
        if to_renew:
            renew_ids = [l['id'] for l in to_renew]
            cur.execute("""
                UPDATE listings 
                SET subscription_expires_at = NOW() + INTERVAL '30 days'
                WHERE id = ANY(%s)
            """, (renew_ids,))
            renewed_titles = [l['title'] for l in to_renew]
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': f'Архивировано: {len(to_archive)}, продлено: {len(to_renew)}',
                'archived_count': len(to_archive),
                'archived_listings': archived_titles,
                'renewed_count': len(to_renew),
                'renewed_listings': renewed_titles
            }, default=str),
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
