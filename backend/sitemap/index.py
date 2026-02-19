import json
import os
from datetime import datetime


def handler(event: dict, context) -> dict:
    """Генерация sitemap.xml для всех страниц сайта с поддержкой image:image для Яндекса"""

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
        city_slugs = []

        try:
            import psycopg2
            dsn = os.environ.get('DATABASE_URL')
            if dsn:
                conn = psycopg2.connect(dsn)
                cursor = conn.cursor()

                # Получаем объявления с изображениями (moderation_status, не status)
                cursor.execute("""
                    SELECT id, city, image_url, title, updated_at
                    FROM listings
                    WHERE is_archived = false
                    AND (moderation_status IS NULL OR moderation_status = 'approved')
                    ORDER BY updated_at DESC
                """)
                listings = cursor.fetchall()

                # Получаем уникальные города из БД для динамического sitemap
                cursor.execute("""
                    SELECT DISTINCT city
                    FROM listings
                    WHERE is_archived = false
                    AND (moderation_status IS NULL OR moderation_status = 'approved')
                    ORDER BY city
                """)
                db_cities = [row[0] for row in cursor.fetchall() if row[0]]

                cursor.close()
                conn.close()

                # Конвертируем название города в slug
                city_slug_map = {
                    'Москва': 'moskva',
                    'Санкт-Петербург': 'sankt-peterburg',
                    'Казань': 'kazan',
                    'Екатеринбург': 'ekaterinburg',
                    'Новосибирск': 'novosibirsk',
                    'Нижний Новгород': 'nizhniy-novgorod',
                    'Челябинск': 'chelyabinsk',
                    'Самара': 'samara',
                    'Омск': 'omsk',
                    'Ростов-на-Дону': 'rostov-na-donu',
                    'Уфа': 'ufa',
                    'Красноярск': 'krasnoyarsk',
                    'Пермь': 'perm',
                    'Воронеж': 'voronezh',
                    'Волгоград': 'volgograd',
                    'Краснодар': 'krasnodar',
                    'Сочи': 'sochi',
                    'Тюмень': 'tyumen',
                    'Барнаул': 'barnaul',
                    'Владивосток': 'vladivostok',
                    'Иркутск': 'irkutsk',
                    'Хабаровск': 'khabarovsk',
                    'Тольятти': 'tolyatti',
                    'Ижевск': 'izhevsk',
                    'Ярославль': 'yaroslavl',
                    'Астрахань': 'astrakhan',
                    'Оренбург': 'orenburg',
                    'Новокузнецк': 'novokuznetsk',
                    'Томск': 'tomsk',
                    'Кемерово': 'kemerovo',
                    'Рязань': 'ryazan',
                    'Набережные Челны': 'naberezhnye-chelny',
                    'Пенза': 'penza',
                    'Чебоксары': 'cheboksary',
                    'Калининград': 'kaliningrad',
                    'Белгород': 'belgorod',
                    'Тула': 'tula',
                    'Курск': 'kursk',
                    'Брянск': 'bryansk',
                    'Улан-Удэ': 'ulan-ude',
                    'Тверь': 'tver',
                    'Магнитогорск': 'magnitogorsk',
                    'Чита': 'chita',
                    'Нижний Тагил': 'nizhniy-tagil',
                    'Вологда': 'vologda',
                    'Архангельск': 'arkhangelsk',
                    'Смоленск': 'smolensk',
                    'Саратов': 'saratov',
                    'Сургут': 'surgut',
                    'Ставрополь': 'stavropol',
                }

                seen_slugs = set()
                for city_name in db_cities:
                    slug = city_slug_map.get(city_name)
                    if slug and slug not in seen_slugs:
                        city_slugs.append(slug)
                        seen_slugs.add(slug)

        except Exception as db_error:
            print(f'DB connection failed: {db_error}')
            # Fallback: стандартный список городов
            city_slugs = [
                'moskva', 'sankt-peterburg', 'kazan', 'ekaterinburg', 'novosibirsk',
                'nizhniy-novgorod', 'chelyabinsk', 'samara', 'omsk', 'rostov-na-donu',
                'ufa', 'krasnoyarsk', 'perm', 'voronezh', 'volgograd', 'krasnodar',
                'sochi', 'tyumen', 'barnaul', 'vladivostok', 'irkutsk'
            ]

        base_url = "https://120minut.ru"
        today = datetime.now().strftime('%Y-%m-%d')

        xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        xml_content += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n'
        xml_content += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

        # Главная страница
        xml_content += '  <url>\n'
        xml_content += f'    <loc>{base_url}/</loc>\n'
        xml_content += f'    <lastmod>{today}</lastmod>\n'
        xml_content += '    <changefreq>daily</changefreq>\n'
        xml_content += '    <priority>1.0</priority>\n'
        xml_content += '  </url>\n'

        # Страницы городов
        for city_slug in city_slugs:
            xml_content += '  <url>\n'
            xml_content += f'    <loc>{base_url}/city/{city_slug}</loc>\n'
            xml_content += f'    <lastmod>{today}</lastmod>\n'
            xml_content += '    <changefreq>weekly</changefreq>\n'
            xml_content += '    <priority>0.9</priority>\n'
            xml_content += '  </url>\n'

        # Страницы объявлений с изображениями
        for listing in listings:
            listing_id, city, image_url, title, updated_at = listing
            lastmod = updated_at.strftime('%Y-%m-%d') if updated_at else today

            xml_content += '  <url>\n'
            xml_content += f'    <loc>{base_url}/listing/{listing_id}</loc>\n'
            xml_content += f'    <lastmod>{lastmod}</lastmod>\n'
            xml_content += '    <changefreq>weekly</changefreq>\n'
            xml_content += '    <priority>0.8</priority>\n'

            # Добавляем изображение если есть
            if image_url:
                # image_url может быть JSON-массивом
                first_image = None
                try:
                    import json as _json
                    images = _json.loads(image_url)
                    if isinstance(images, list) and images:
                        first_image = images[0]
                    elif isinstance(images, str):
                        first_image = images
                except Exception:
                    first_image = image_url

                if first_image and first_image.startswith('http'):
                    safe_title = (title or '').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
                    xml_content += '    <image:image>\n'
                    xml_content += f'      <image:loc>{first_image}</image:loc>\n'
                    xml_content += f'      <image:title>{safe_title}</image:title>\n'
                    xml_content += '    </image:image>\n'

            xml_content += '  </url>\n'

        xml_content += '</urlset>'

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/xml; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600',
                'X-Robots-Tag': 'noindex'
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
