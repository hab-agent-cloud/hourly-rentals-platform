import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''Публичный API для получения списка активных объектов'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
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
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Параметры пагинации и фильтрации
        params = event.get('queryStringParameters', {}) or {}
        page = int(params.get('page', 1))
        per_page = min(int(params.get('per_page', 50)), 100)  # Максимум 100 за раз
        city = params.get('city')
        listing_type = params.get('type')
        
        offset = (page - 1) * per_page
        
        # Подсчёт общего количества
        count_query = """
            SELECT COUNT(*) as total
            FROM t_p39732784_hourly_rentals_platf.listings l
            WHERE l.is_archived = false 
            AND (l.moderation_status IS NULL OR l.moderation_status = 'approved')
        """
        count_params = []
        
        if city:
            count_query += " AND l.city = %s"
            count_params.append(city)
        if listing_type:
            count_query += " AND l.type = %s"
            count_params.append(listing_type)
        
        cur.execute(count_query, count_params)
        total = cur.fetchone()['total']
        
        # Получаем объекты с пагинацией
        query = """
            SELECT 
                l.id, l.title, l.type, l.city, l.district, l.price, l.rating, l.reviews, 
                l.auction, l.image_url, l.logo_url, l.metro, l.metro_walk as "metroWalk", 
                l.has_parking as "hasParking", l.parking_type, l.parking_price_per_hour,
                l.features, l.lat, l.lng, 
                l.min_hours as "minHours", l.phone, l.telegram,
                l.price_warning_holidays, l.price_warning_daytime
            FROM t_p39732784_hourly_rentals_platf.listings l
            WHERE l.is_archived = false 
            AND (l.moderation_status IS NULL OR l.moderation_status = 'approved')
        """
        query_params = []
        
        if city:
            query += " AND l.city = %s"
            query_params.append(city)
        if listing_type:
            query += " AND l.type = %s"
            query_params.append(listing_type)
        
        query += " ORDER BY l.city ASC, l.auction ASC, l.id ASC"
        query += f" LIMIT %s OFFSET %s"
        query_params.extend([per_page, offset])
        
        cur.execute(query, query_params)
        listings = cur.fetchall()
        
        if not listings:
            cur.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([]),
                'isBase64Encoded': False
            }
        
        # Получаем все комнаты одним запросом
        listing_ids = [l['id'] for l in listings]
        placeholders = ','.join(['%s'] * len(listing_ids))
        cur.execute(
            f"""SELECT listing_id, type, price, description, square_meters, features, 
                       min_hours, payment_methods, cancellation_policy 
                FROM t_p39732784_hourly_rentals_platf.rooms 
                WHERE listing_id IN ({placeholders})""",
            listing_ids
        )
        all_rooms = cur.fetchall()
        
        # Получаем все станции метро одним запросом
        cur.execute(
            f"""SELECT listing_id, station_name, walk_minutes 
                FROM t_p39732784_hourly_rentals_platf.metro_stations 
                WHERE listing_id IN ({placeholders})""",
            listing_ids
        )
        all_metro = cur.fetchall()
        
        # Группируем по listing_id
        rooms_by_listing = {}
        for room in all_rooms:
            lid = room.pop('listing_id')
            if lid not in rooms_by_listing:
                rooms_by_listing[lid] = []
            rooms_by_listing[lid].append(room)
        
        metro_by_listing = {}
        for metro in all_metro:
            lid = metro.pop('listing_id')
            if lid not in metro_by_listing:
                metro_by_listing[lid] = []
            metro_by_listing[lid].append(metro)
        
        # Присваиваем данные каждому объекту
        for listing in listings:
            listing['rooms'] = rooms_by_listing.get(listing['id'], [])
            listing['metro_stations'] = metro_by_listing.get(listing['id'], [])
        
        cur.close()
        conn.close()
        
        # Возвращаем с метаданными пагинации
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'data': listings,
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': total,
                    'total_pages': (total + per_page - 1) // per_page
                }
            }, default=str),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        if conn:
            conn.close()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }