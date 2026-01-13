import json
import os
import psycopg2
import secrets
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    '''API для восстановления пароля владельцев отелей'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
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
    
    body = json.loads(event.get('body', '{}'))
    action = body.get('action')
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if action == 'request':
            identifier = body.get('identifier', '').strip().lower()
            
            if not identifier:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Введите email или телефон'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT id, email, phone, password_hash 
                FROM owners 
                WHERE email = %s OR phone = %s
            """, (identifier, identifier))
            
            owner = cur.fetchone()
            
            if not owner:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Владелец с такими данными не найден'}),
                    'isBase64Encoded': False
                }
            
            owner_id, email, phone, password_hash = owner
            
            token = secrets.token_urlsafe(32)
            expires_at = datetime.utcnow() + timedelta(hours=1)
            
            cur.execute("""
                INSERT INTO password_recovery_tokens (owner_id, token, expires_at)
                VALUES (%s, %s, %s)
            """, (owner_id, token, expires_at))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'Токен восстановления создан',
                    'token': token,
                    'email': email,
                    'phone': phone,
                    'password_hash': password_hash
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'verify':
            token = body.get('token', '').strip()
            
            if not token:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Токен не указан'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT prt.id, prt.owner_id, prt.expires_at, prt.used,
                       o.email, o.phone, o.password_hash
                FROM password_recovery_tokens prt
                JOIN owners o ON o.id = prt.owner_id
                WHERE prt.token = %s
            """, (token,))
            
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный токен'}),
                    'isBase64Encoded': False
                }
            
            token_id, owner_id, expires_at, used, email, phone, password_hash = result
            
            if used:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Токен уже использован'}),
                    'isBase64Encoded': False
                }
            
            if datetime.utcnow() > expires_at:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Токен истек'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                UPDATE password_recovery_tokens SET used = TRUE WHERE id = %s
            """, (token_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'Токен подтвержден',
                    'owner_id': owner_id,
                    'email': email,
                    'phone': phone,
                    'password_hash': password_hash
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Unknown action'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
