"""API для получения доступных объектов для добавления в сопровождение"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """Получение списка свободных объектов по городам для менеджера"""
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
        city = params.get('city')
        
        if not city:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указан город'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Получаем объекты в выбранном городе, которые еще не взяты другими менеджерами
                cur.execute("""
                    SELECT 
                        l.id, 
                        l.title as name,
                        l.short_title,
                        l.district,
                        l.city,
                        l.image_url as photo,
                        l.subscription_expires_at,
                        l.status,
                        CASE WHEN ml.id IS NOT NULL THEN true ELSE false END as has_manager
                    FROM t_p39732784_hourly_rentals_platf.listings l
                    LEFT JOIN t_p39732784_hourly_rentals_platf.manager_listings ml ON l.id = ml.listing_id
                    WHERE l.city = %s 
                      AND l.is_archived = false
                      AND l.status = 'active'
                      AND ml.id IS NULL
                    ORDER BY l.created_at DESC
                    LIMIT 500
                """, (city,))
                
                listings = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'city': city,
                        'listings': listings,
                        'total': len(listings)
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
