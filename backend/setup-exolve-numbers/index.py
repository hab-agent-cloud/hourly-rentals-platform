import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """
    Настраивает webhook для всех виртуальных номеров в МТС Exolve.
    Привязывает номера к webhook route-call для автоматической переадресации.
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
    
    webhook_url = 'https://functions.poehali.dev/118f6961-69ab-4912-bbec-0481012af402'
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("SELECT phone FROM virtual_numbers WHERE is_active = TRUE OR is_active IS NULL ORDER BY id")
        numbers = cur.fetchall()
        
        cur.close()
        conn.close()
        
        results = []
        
        for row in numbers:
            phone = row['phone']
            # Убираем + — Exolve принимает number_code как целое число
            import re
            phone_digits = int(re.sub(r'[^\d]', '', phone))
            
            # POST https://api.exolve.ru/number/v1/SetCallForwarding
            # call_forwarding_type: 3 = переадресация на URL (IPCR/webhook)
            api_url = 'https://api.exolve.ru/number/v1/SetCallForwarding'
            
            config_data = {
                'number_code': phone_digits,
                'call_forwarding_type': 3,
                'call_forwarding_ipcr': {
                    'url': webhook_url
                }
            }
            
            headers = {
                'Authorization': f'Bearer {exolve_api_key}',
                'Content-Type': 'application/json'
            }
            
            try:
                req = urllib.request.Request(
                    api_url,
                    data=json.dumps(config_data).encode('utf-8'),
                    headers=headers,
                    method='POST'
                )
                
                try:
                    with urllib.request.urlopen(req, timeout=10) as response:
                        resp_text = response.read().decode('utf-8')
                        results.append({
                            'phone': phone,
                            'status': 'configured',
                            'webhook': webhook_url,
                            'response': resp_text
                        })
                        print(f"[SETUP] Configured {phone} -> {webhook_url}: {resp_text}")
                except urllib.error.HTTPError as e:
                    err_body = e.read().decode('utf-8')
                    results.append({
                        'phone': phone,
                        'status': 'error',
                        'error': f"HTTP {e.code}: {err_body}"
                    })
                    print(f"[SETUP] Error for {phone}: HTTP {e.code}: {err_body}")
                        
            except Exception as e:
                results.append({
                    'phone': phone,
                    'status': 'error',
                    'error': str(e)
                })
                print(f"[SETUP] Exception for {phone}: {str(e)}")
        
        success_count = sum(1 for r in results if r['status'] == 'configured')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': success_count,
                'total': len(results),
                'results': results
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }