import json
import os
import urllib.request
import urllib.parse
from datetime import datetime


def handler(event: dict, context) -> dict:
    """Ежедневный пинг sitemap в Яндекс.Вебмастер и Google для ускорения индексации"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': '',
        }

    sitemap_url = 'https://120minut.ru/sitemap.xml'
    results = []

    ping_urls = [
        f'https://webmaster.yandex.ru/ping?sitemap={urllib.parse.quote(sitemap_url, safe="")}',
        f'https://www.google.com/ping?sitemap={urllib.parse.quote(sitemap_url, safe="")}',
    ]

    for url in ping_urls:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': '120minut-sitemap-ping/1.0'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                status = resp.status
                results.append({'url': url, 'status': status, 'ok': status in (200, 201, 202)})
        except Exception as e:
            results.append({'url': url, 'status': 0, 'ok': False, 'error': str(e)})

    all_ok = all(r['ok'] for r in results)

    print(f'[{datetime.utcnow().isoformat()}] Sitemap ping: {"OK" if all_ok else "PARTIAL"} | {results}')

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'sitemap': sitemap_url,
            'pinged_at': datetime.utcnow().isoformat() + 'Z',
            'results': results,
        }),
        'isBase64Encoded': False,
    }
