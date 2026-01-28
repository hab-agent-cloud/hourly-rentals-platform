import json
import os
from datetime import datetime


def handler(event: dict, context) -> dict:
    """Генерация sitemap.xml для всех страниц сайта"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        listings = []
        
        try:
            import psycopg2
            dsn = os.environ.get('DATABASE_URL')
            if dsn:
                conn = psycopg2.connect(dsn)
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT id, city, updated_at 
                    FROM listings 
                    WHERE is_archived = false 
                    AND status = 'approved'
                """)
                listings = cursor.fetchall()
                cursor.close()
                conn.close()
        except Exception as db_error:
            print(f'DB connection failed: {db_error}')
            pass
        
        base_url = "https://120minut.ru"
        today = datetime.now().strftime('%Y-%m-%d')
        
        sitemap_urls = []
        
        sitemap_urls.append({
            'loc': base_url,
            'lastmod': today,
            'changefreq': 'daily',
            'priority': '1.0'
        })
        
        cities = [
            'moskva', 'sankt-peterburg', 'kazan', 'ekaterinburg', 
            'ufa', 'rostov-na-donu', 'krasnodar', 'nizhniy-novgorod', 'novosibirsk'
        ]
        
        for city_slug in cities:
            sitemap_urls.append({
                'loc': f'{base_url}/city/{city_slug}',
                'lastmod': today,
                'changefreq': 'weekly',
                'priority': '0.9'
            })
        
        for listing_id, city, updated_at in listings:
            lastmod = updated_at.strftime('%Y-%m-%d') if updated_at else today
            sitemap_urls.append({
                'loc': f'{base_url}/listing/{listing_id}',
                'lastmod': lastmod,
                'changefreq': 'weekly',
                'priority': '0.8'
            })
        
        xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        for url_data in sitemap_urls:
            xml_content += '  <url>\n'
            xml_content += f'    <loc>{url_data["loc"]}</loc>\n'
            xml_content += f'    <lastmod>{url_data["lastmod"]}</lastmod>\n'
            xml_content += f'    <changefreq>{url_data["changefreq"]}</changefreq>\n'
            xml_content += f'    <priority>{url_data["priority"]}</priority>\n'
            xml_content += '  </url>\n'
        
        xml_content += '</urlset>'
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/xml',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            },
            'body': xml_content
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Failed to generate sitemap',
                'details': str(e)
            })
        }