import json
import os
import psycopg2
from datetime import datetime
import hashlib

def handler(event, context):
    '''Добавление владельца менеджером с созданием учетной записи и привязкой к объекту'''
    
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
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        manager_id = body.get('manager_id')
        full_name = body.get('full_name')
        phone = body.get('phone')
        email = body.get('email', '')
        telegram_name = body.get('telegram_name', '')
        manager_comment = body.get('manager_comment', '')
        username = body.get('username')
        password = body.get('password')
        listing_id = body.get('listing_id')
        
        if not manager_id or not full_name or not phone or not username or not password:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не заполнены обязательные поля: manager_id, full_name, phone, username, password'}),
                'isBase64Encoded': False
            }
        
        # Email обязателен в БД, используем username если email пуст
        if not email:
            email = f'{username}@temp.local'
        
        if len(password) < 6:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Пароль должен содержать минимум 6 символов'}),
                'isBase64Encoded': False
            }
        
        dsn = os.environ['DATABASE_URL']
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        # Проверка прав менеджера
        cur.execute("""
            SELECT role FROM t_p39732784_hourly_rentals_platf.admins 
            WHERE id = %s AND role IN ('manager', 'om', 'um', 'superadmin')
        """, (manager_id,))
        
        manager = cur.fetchone()
        if not manager:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Нет прав для создания владельца'}),
                'isBase64Encoded': False
            }
        
        # Проверка уникальности username
        cur.execute("""
            SELECT id FROM t_p39732784_hourly_rentals_platf.owners 
            WHERE username = %s
        """, (username,))
        
        if cur.fetchone():
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Логин "{username}" уже занят. Выберите другой логин.'}),
                'isBase64Encoded': False
            }
        
        # Хэширование пароля
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        # Создание владельца
        cur.execute("""
            INSERT INTO t_p39732784_hourly_rentals_platf.owners 
            (full_name, phone, email, telegram_name, manager_comment, username, 
             password_hash, created_by_manager_id, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
            RETURNING id
        """, (
            full_name, phone, email, telegram_name, manager_comment, username, password_hash, manager_id
        ))
        
        owner_id = cur.fetchone()[0]
        
        # Привязка к объекту (если указан)
        if listing_id:
            # Проверка что объект в сопровождении менеджера
            cur.execute("""
                SELECT id FROM t_p39732784_hourly_rentals_platf.manager_listings
                WHERE manager_id = %s AND listing_id = %s AND status = 'active'
            """, (manager_id, listing_id))
            
            if cur.fetchone():
                # Привязываем владельца к объекту
                cur.execute("""
                    UPDATE t_p39732784_hourly_rentals_platf.listings
                    SET owner_id = %s
                    WHERE id = %s
                """, (owner_id, listing_id))
                
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'owner_id': owner_id,
                        'username': username,
                        'message': f'Владелец "{full_name}" создан и привязан к объекту'
                    }),
                    'isBase64Encoded': False
                }
            else:
                # Объект не в сопровождении менеджера
                conn.rollback()
                cur.close()
                conn.close()
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Выбранный объект не в вашем сопровождении'}),
                    'isBase64Encoded': False
                }
        else:
            # Просто создаем владельца без привязки
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'owner_id': owner_id,
                    'username': username,
                    'message': f'Владелец "{full_name}" создан без привязки к объекту'
                }),
                'isBase64Encoded': False
            }
        
    except Exception as e:
        print(f'Error: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }