import json
import os
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    """
    Создаёт голосовое приветствие через МТС Exolve Media API (text-to-speech)
    и возвращает ID файла для использования в переадресации.
    """
    method = event.get('httpMethod', 'POST')
    
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
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    exolve_api_key = os.environ.get('EXOLVE_API_KEY')
    if not exolve_api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'EXOLVE_API_KEY not configured'})
        }
    
    body = event.get('body', '{}')
    if not body or body == '':
        body = '{}'
    
    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        data = {}
    
    greeting_text = data.get('text', 'Здравствуйте! Соединяем вас с владельцем.')
    voice = data.get('voice', 'Anna')
    
    try:
        # МТС Exolve Media API - синтез речи и сохранение
        # Документация: https://docs.exolve.ru/docs/ru/api-reference/media-api/
        url = 'https://api.exolve.ru/media/v1/SynthesizeAndSave'
        
        # Параметры для синтеза речи
        # voice: 1-21 (1 - Алёна, 2 - Анна, и т.д.)
        voice_map = {
            'Anna': 2,
            'Alena': 1,
            'Male': 10
        }
        
        tts_data = {
            'text': greeting_text,
            'voice': voice_map.get(voice, 2),  # По умолчанию Анна
            'lang': 1,  # Русский
            'emotion': 1,  # Нейтральная
            'speed': 1.0,  # Нормальная скорость
            'loudness_normalization': -20
        }
        
        headers = {
            'Authorization': f'Bearer {exolve_api_key}',
            'Content-Type': 'application/json'
        }
        
        print(f"[GREETING] Creating audio: {greeting_text}")
        
        req = urllib.request.Request(
            url,
            data=json.dumps(tts_data).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            if response.status in (200, 201):
                file_id = result.get('fileId') or result.get('id')
                print(f"[GREETING] Audio created successfully: {file_id}")
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'file_id': file_id,
                        'text': greeting_text,
                        'voice': voice,
                        'status': 'created'
                    })
                }
            else:
                print(f"[GREETING] Error: {result}")
                return {
                    'statusCode': response.status,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'error': 'Failed to create audio',
                        'details': result
                    })
                }
                
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"[GREETING] HTTP Error: {e.code} - {error_body}")
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': f'HTTP {e.code}',
                'details': error_body
            })
        }
    except Exception as e:
        print(f"[GREETING] Exception: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }