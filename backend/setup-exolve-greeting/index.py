import json
import os
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    """
    Настраивает голосовое приветствие для виртуальных номеров Exolve.
    Проигрывает текст: "Здравствуйте, у Вас хотят забронировать номер с сайта 120минут.ру"
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
    
    body = event.get('body', '{}')
    if not body or body == '':
        body = '{}'
    
    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    
    phone_number = data.get('phone_number')
    target_phone = data.get('target_phone')
    
    if not phone_number or not target_phone:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'phone_number and target_phone are required'})
        }
    
    exolve_api_key = os.environ.get('EXOLVE_API_KEY')
    if not exolve_api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Exolve API key not configured'})
        }
    
    try:
        url = 'https://api.exolve.ru/number/v1/SetCallForwarding'
        
        phone_without_plus = phone_number.lstrip('+')
        target_without_plus = target_phone.lstrip('+')
        
        rule_data = {
            'number_code': int(phone_without_plus),
            'call_forwarding_type': 'CALL_FORWARDING_TYPE_NUMBER',
            'call_forwarding_number': {
                'call_control': [
                    {
                        'redirect_number': target_without_plus,
                        'timeout': '30',
                        'active': True
                    }
                ],
                'answer': True
            }
        }
        
        headers = {
            'Authorization': f'Bearer {exolve_api_key}',
            'Content-Type': 'application/json'
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(rule_data).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=15) as response:
            response_text = response.read().decode('utf-8')
            
            if response.status == 200:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': f'Call forwarding configured: {phone_number} -> {target_phone}',
                        'details': response_text
                    })
                }
            else:
                return {
                    'statusCode': response.status,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'error': 'Failed to configure call forwarding',
                        'details': response_text
                    })
                }
                
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': f'Exolve API error: {e.code}',
                'details': error_body
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }