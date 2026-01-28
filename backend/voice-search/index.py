import json
import os
from openai import OpenAI

def handler(event: dict, context) -> dict:
    '''API для обработки голосового поиска отелей через GPT-4o-mini'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Получаем текст из запроса
    body = json.loads(event.get('body', '{}'))
    transcript = body.get('transcript', '').strip()
    
    if not transcript:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Transcript is required'})
        }
    
    # Инициализируем OpenAI
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'OpenAI API key not configured'})
        }
    
    client = OpenAI(api_key=api_key)
    
    # Формируем промпт для GPT
    system_prompt = """Ты — ассистент для парсинга голосового запроса на поиск почасовых отелей.

Города в системе: Москва, Санкт-Петербург, Казань, Самара, Екатеринбург.

Твоя задача — извлечь из голосового запроса фильтры и вернуть JSON строго в формате:
{
  "city": "moskva" | "sankt-peterburg" | "kazan" | "samara" | "ekaterinburg" | null,
  "priceMin": number | null,
  "priceMax": number | null,
  "metro": string | null,
  "district": string | null,
  "query": string
}

Правила:
- city: слаг города (если упомянут)
- priceMin/priceMax: цена в рублях за 2 часа
- metro: станция метро (если упомянута)
- district: район города (если упомянут)
- query: исходный запрос пользователя

Примеры:
"Москва, метро Чистые пруды, до 1000 рублей" → {"city": "moskva", "priceMax": 1000, "metro": "Чистые пруды", "query": "..."}
"Питер, центр, 500-800 рублей" → {"city": "sankt-peterburg", "priceMin": 500, "priceMax": 800, "district": "центр", "query": "..."}
"Казань недорого" → {"city": "kazan", "query": "..."}

Отвечай ТОЛЬКО валидным JSON без комментариев."""
    
    try:
        # Вызываем GPT-4o-mini
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': transcript}
            ],
            temperature=0.3,
            max_tokens=200
        )
        
        # Парсим ответ
        result_text = response.choices[0].message.content.strip()
        
        # Убираем markdown форматирование если есть
        if result_text.startswith('```'):
            result_text = result_text.split('```')[1]
            if result_text.startswith('json'):
                result_text = result_text[4:]
        
        filters = json.loads(result_text)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(filters)
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Failed to parse GPT response', 'raw': result_text})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
