import json
import os
import urllib.request
import urllib.parse
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для геокодирования адресов объектов через Яндекс.Карты'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    if method == 'POST':
        db_url = os.environ.get('DATABASE_URL')
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute(f"SELECT id, city, district, metro, address FROM {schema}.listings WHERE (lat IS NULL OR lat = 0) AND is_archived = false LIMIT 50")
        listings = cur.fetchall()
        
        updated_count = 0
        failed_count = 0
        
        import time
        
        for listing in listings:
            listing_id, city, district, metro, address = listing
            
            search_query = address if address else f"{city}, {district}, Россия"
            if metro:
                search_query += f", метро {metro}"
            
            encoded_query = urllib.parse.quote(search_query)
            url = f"https://nominatim.openstreetmap.org/search?q={encoded_query}&format=json&limit=1"
            
            try:
                print(f"Geocoding listing {listing_id}: {search_query}")
                req = urllib.request.Request(url, headers={'User-Agent': '120minut-platform/1.0'})
                with urllib.request.urlopen(req, timeout=10) as response:
                    data = json.loads(response.read())
                
                if data and len(data) > 0:
                    lat = float(data[0]['lat'])
                    lng = float(data[0]['lon'])
                    
                    print(f"Found coordinates for {listing_id}: lat={lat}, lng={lng}")
                    cur.execute(f"UPDATE {schema}.listings SET lat = %s, lng = %s WHERE id = %s", (lat, lng, listing_id))
                    updated_count += 1
                else:
                    print(f"No coordinates found for {listing_id}: {search_query}")
                    failed_count += 1
                
                time.sleep(1)
                    
            except Exception as e:
                failed_count += 1
                print(f"Failed to geocode listing {listing_id}: {str(e)}")
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'updated': updated_count,
                'failed': failed_count,
                'total': len(listings)
            })
        }

    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }