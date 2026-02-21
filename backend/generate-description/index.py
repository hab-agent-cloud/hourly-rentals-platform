import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
import urllib.error


def call_openai(prompt: str, max_tokens: int = 1000) -> str:
    api_key = os.environ.get('OPENAI_API_KEY', '')
    if not api_key:
        raise ValueError('OPENAI_API_KEY not configured')

    data = json.dumps({
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "Ты — копирайтер для сайта почасовой аренды номеров. Пиши живо, без воды, по делу. Без приветствий и заголовков. Только текст описания."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=data,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        },
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    return result['choices'][0]['message']['content'].strip()


def handler(event: dict, context) -> dict:
    """Генерация описания объекта через AI на основе данных и фото"""

    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

    raw_body = event.get('body', '{}')
    print(f"RAW_BODY type={type(raw_body).__name__} repr={repr(raw_body)[:300]}")
    print(f"EVENT keys={list(event.keys())}")
    if isinstance(raw_body, dict):
        body = raw_body
    else:
        parsed = json.loads(raw_body or '{}')
        if isinstance(parsed, str):
            body = json.loads(parsed)
        else:
            body = parsed
    listing_id = body.get('listing_id')
    print(f"BODY={body}, listing_id={listing_id}")

    if not listing_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'listing_id is required'}),
            'isBase64Encoded': False
        }

    conn = None
    try:
        dsn = os.environ.get('DATABASE_URL')
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute(f"""
            SELECT id, title, type, city, district, address, metro, 
                   has_parking, parking_type, image_url, description
            FROM {schema}.listings
            WHERE id = %s
        """, (listing_id,))
        listing = cur.fetchone()

        if not listing:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Listing not found'}),
                'isBase64Encoded': False
            }

        cur.execute(f"""
            SELECT type, price, square_meters, min_hours, features
            FROM {schema}.rooms
            WHERE listing_id = %s
            ORDER BY id
        """, (listing_id,))
        rooms = cur.fetchall()

        cur.execute(f"""
            SELECT station_name, walk_minutes
            FROM {schema}.metro_stations
            WHERE listing_id = %s
        """, (listing_id,))
        metro_stations = cur.fetchall()

        cur.close()
        conn.close()
        conn = None

        print(f"DB DONE: listing_found={listing is not None}, rooms_count={len(rooms)}, metro_count={len(metro_stations)}")
        parts = []
        parts.append(f"Название: {listing['title']}")
        if listing.get('type'):
            parts.append(f"Тип: {listing['type']}")
        parts.append(f"Город: {listing['city']}")
        if listing.get('district'):
            parts.append(f"Район: {listing['district']}")
        if listing.get('address'):
            parts.append(f"Адрес: {listing['address']}")

        if metro_stations:
            metro_info = ', '.join([f"{m['station_name']} ({m['walk_minutes']} мин пешком)" for m in metro_stations])
            parts.append(f"Метро: {metro_info}")
        elif listing.get('metro'):
            parts.append(f"Метро: {listing['metro']}")

        if listing.get('has_parking'):
            parking_desc = {'free': 'бесплатная', 'paid': 'платная', 'street': 'стихийная', 'spontaneous': 'стихийная'}
            p_type = parking_desc.get(listing.get('parking_type', ''), listing.get('parking_type', ''))
            parts.append(f"Парковка: {p_type}")

        if rooms:
            parts.append(f"\nКатегории номеров ({len(rooms)}):")
            for r in rooms:
                room_info = f"- {r['type']}"
                if r.get('price'):
                    room_info += f", от {r['price']}₽"
                if r.get('square_meters'):
                    room_info += f", {r['square_meters']} м²"
                if r.get('min_hours'):
                    room_info += f", мин. {r['min_hours']}ч"
                if r.get('features'):
                    feats = r['features'] if isinstance(r['features'], list) else []
                    if feats:
                        room_info += f" ({', '.join(feats[:8])})"
                parts.append(room_info)

        images = []
        if listing.get('image_url'):
            try:
                parsed = json.loads(listing['image_url']) if isinstance(listing['image_url'], str) else listing['image_url']
                if isinstance(parsed, list):
                    images = parsed[:3]
                else:
                    images = [str(listing['image_url'])]
            except (json.JSONDecodeError, TypeError):
                images = [str(listing['image_url'])]

        if images:
            parts.append(f"\nФото объекта: {len(images)} шт.")

        listing_info = '\n'.join(parts)

        prompt = f"""Напиши привлекательное описание для объекта почасовой аренды. 
Описание должно быть 3-5 абзацев, без заголовков. Упомяни ключевые преимущества: расположение, удобства номеров, особенности.
Пиши от третьего лица. Не придумывай то, чего нет в данных. Если информации мало — сделай акцент на том что есть.

Данные объекта:
{listing_info}"""

        if images:
            prompt += f"\n\nОбъект имеет {len(images)} фотографий — упомяни что можно оценить обстановку по фото."

        description = call_openai(prompt)

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'description': description}),
            'isBase64Encoded': False
        }

    except ValueError as e:
        print(f"ERROR ValueError: {e}")
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else ''
        print(f"ERROR OpenAI HTTPError: {e.code}, body={error_body[:500]}")
        return {
            'statusCode': 502,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'OpenAI API error: {e.code}', 'details': error_body[:200]}),
            'isBase64Encoded': False
        }
    except Exception as e:
        import traceback
        print(f"ERROR Exception: {type(e).__name__}: {e}")
        print(traceback.format_exc())
        if conn:
            conn.close()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }