import json
import os
import requests

def handler(event: dict, context) -> dict:
    '''Определение города посетителя по IP-адресу'''
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
        # Получаем IP из запроса
        request_context = event.get('requestContext', {})
        identity = request_context.get('identity', {})
        source_ip = identity.get('sourceIp', '')
        
        # Для локальной разработки или внутренних IP возвращаем дефолтный город
        if not source_ip or source_ip.startswith('127.') or source_ip.startswith('192.168.') or source_ip.startswith('10.'):
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'city': None,
                    'ip': source_ip,
                    'detected': False
                }),
                'isBase64Encoded': False
            }
        
        # Используем бесплатный сервис ipapi.co для определения города
        try:
            response = requests.get(f'https://ipapi.co/{source_ip}/json/', timeout=3)
            if response.status_code == 200:
                data = response.json()
                city = data.get('city')
                country = data.get('country_name')
                
                # Проверяем, что это Россия и город определён
                if country == 'Russia' and city:
                    # Переводим названия городов в русский
                    city_mapping = {
                        'Moscow': 'Москва',
                        'Saint Petersburg': 'Санкт-Петербург',
                        'Novosibirsk': 'Новосибирск',
                        'Yekaterinburg': 'Екатеринбург',
                        'Kazan': 'Казань',
                        'Nizhniy Novgorod': 'Нижний Новгород',
                        'Chelyabinsk': 'Челябинск',
                        'Samara': 'Самара',
                        'Omsk': 'Омск',
                        'Rostov-on-Don': 'Ростов-на-Дону',
                        'Ufa': 'Уфа',
                        'Krasnoyarsk': 'Красноярск',
                        'Voronezh': 'Воронеж',
                        'Perm': 'Пермь',
                        'Volgograd': 'Волгоград'
                    }
                    
                    russian_city = city_mapping.get(city, city)
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'city': russian_city,
                            'ip': source_ip,
                            'detected': True,
                            'country': country
                        }),
                        'isBase64Encoded': False
                    }
        except Exception as api_error:
            print(f'IP API error: {str(api_error)}')
        
        # Если не удалось определить - возвращаем null
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'city': None,
                'ip': source_ip,
                'detected': False
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
