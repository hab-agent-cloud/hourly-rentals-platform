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
        
        cur.execute(f"SELECT id, city, district, metro, address FROM {schema}.listings WHERE (lat IS NULL OR lat = 0) AND is_archived = false LIMIT 20")
        listings = cur.fetchall()
        
        updated_count = 0
        failed_count = 0
        
        import time
        
        for listing in listings:
            listing_id, city, district, metro, address = listing
            
            search_queries = []
            if address:
                clean_address = address.split(',')[0].strip()
                search_queries.append(f"{clean_address}, {city}, Россия")
            
            search_queries.append(f"{city}, Россия")
            
            lat_found, lng_found = None, None
            
            for search_query in search_queries:
                try:
                    print(f"Geocoding listing {listing_id}: {search_query}")
                    encoded_query = urllib.parse.quote(search_query)
                    url = f"https://nominatim.openstreetmap.org/search?q={encoded_query}&format=json&limit=1"
                    
                    req = urllib.request.Request(url, headers={'User-Agent': '120minut-platform/1.0'})
                    with urllib.request.urlopen(req, timeout=5) as response:
                        data = json.loads(response.read())
                    
                    if data and len(data) > 0:
                        lat_found = float(data[0]['lat'])
                        lng_found = float(data[0]['lon'])
                        print(f"Found coordinates for {listing_id}: lat={lat_found}, lng={lng_found}")
                        break
                    
                    time.sleep(0.3)
                        
                except Exception as e:
                    print(f"Failed query for {listing_id}: {str(e)}")
            
            if lat_found and lng_found:
                cur.execute(f"UPDATE {schema}.listings SET lat = %s, lng = %s WHERE id = %s", (lat_found, lng_found, listing_id))
                updated_count += 1
            else:
                print(f"No coordinates found for listing {listing_id}")
                failed_count += 1
            
            time.sleep(0.5)
        
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