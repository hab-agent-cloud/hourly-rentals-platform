import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

UNLOCK_TIERS = {
    10: 10000,   # до 10 квартир — 10 000₽
    20: 15000,   # до 20 квартир — 15 000₽
}

BASE_LIMIT = 5  # Базовый лимит квартир для бюро

def handler(event: dict, context) -> dict:
    '''API для получения лимита квартир бюро и покупки разблокировки'''

    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization, Authorization'
            },
            'body': ''
        }

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        if method == 'GET':
            # Получить текущий лимит и историю разблокировок для владельца
            query_params = event.get('queryStringParameters') or {}
            owner_id = query_params.get('owner_id')

            if not owner_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'owner_id required'})
                }

            owner_id = int(owner_id)

            # Получаем максимальную разблокировку владельца
            cur.execute(
                f"SELECT MAX(unlock_level) as max_level FROM {schema}.owner_room_unlocks WHERE owner_id = %s",
                (owner_id,)
            )
            row = cur.fetchone()
            max_unlock = row['max_level'] if row and row['max_level'] else None
            current_limit = max_unlock if max_unlock else BASE_LIMIT

            # Считаем текущие квартиры в бюро
            cur.execute(
                f"""SELECT COUNT(*) as room_count 
                    FROM {schema}.rooms r
                    JOIN {schema}.listings l ON l.id = r.listing_id
                    WHERE l.owner_id = %s AND l.type = 'bureau' AND l.is_archived = FALSE""",
                (owner_id,)
            )
            count_row = cur.fetchone()
            current_rooms = count_row['room_count'] if count_row else 0

            # Доступные уровни разблокировки
            available_unlocks = [
                {'rooms': rooms, 'price': price}
                for rooms, price in UNLOCK_TIERS.items()
                if rooms > current_limit
            ]

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'current_limit': current_limit,
                    'current_rooms': current_rooms,
                    'base_limit': BASE_LIMIT,
                    'available_unlocks': available_unlocks,
                    'unlock_tiers': [
                        {'rooms': 10, 'price': 10000},
                        {'rooms': 20, 'price': 15000},
                    ]
                })
            }

        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            owner_id = body.get('owner_id')
            unlock_level = body.get('unlock_level')  # 10 или 20

            if not owner_id or not unlock_level:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'owner_id и unlock_level обязательны'})
                }

            owner_id = int(owner_id)
            unlock_level = int(unlock_level)

            if unlock_level not in UNLOCK_TIERS:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Недопустимый уровень разблокировки. Доступно: {list(UNLOCK_TIERS.keys())}'})
                }

            price = UNLOCK_TIERS[unlock_level]

            # Проверяем текущий лимит
            cur.execute(
                f"SELECT MAX(unlock_level) as max_level FROM {schema}.owner_room_unlocks WHERE owner_id = %s",
                (owner_id,)
            )
            row = cur.fetchone()
            current_limit = row['max_level'] if row and row['max_level'] else BASE_LIMIT

            if unlock_level <= current_limit:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Уровень {unlock_level} уже разблокирован или ниже текущего лимита {current_limit}'})
                }

            # Проверяем баланс
            cur.execute(
                f"SELECT balance, bonus_balance FROM {schema}.owners WHERE id = %s",
                (owner_id,)
            )
            owner = cur.fetchone()
            if not owner:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Владелец не найден'})
                }

            total_balance = owner['balance'] + owner['bonus_balance']
            if total_balance < price:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'error': 'Недостаточно средств на балансе',
                        'required': price,
                        'available': total_balance
                    })
                }

            # Списываем средства (сначала бонусы, потом основной баланс)
            bonus_used = min(owner['bonus_balance'], price)
            balance_used = price - bonus_used

            cur.execute(
                f"""UPDATE {schema}.owners 
                    SET balance = balance - %s, bonus_balance = bonus_balance - %s
                    WHERE id = %s""",
                (balance_used, bonus_used, owner_id)
            )

            # Записываем разблокировку
            cur.execute(
                f"""INSERT INTO {schema}.owner_room_unlocks 
                    (owner_id, unlock_level, price_paid, payment_method, created_by)
                    VALUES (%s, %s, %s, 'balance', 'owner')
                    RETURNING id""",
                (owner_id, unlock_level, price)
            )
            unlock_id = cur.fetchone()['id']

            # Записываем транзакцию
            cur.execute(
                f"""INSERT INTO {schema}.transactions 
                    (owner_id, amount, type, description, balance_after)
                    VALUES (%s, %s, 'unlock', %s,
                            (SELECT balance + bonus_balance FROM {schema}.owners WHERE id = %s))""",
                (owner_id, -price, f'Разблокировка до {unlock_level} квартир в бюро', owner_id)
            )

            conn.commit()

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'unlock_id': unlock_id,
                    'new_limit': unlock_level,
                    'message': f'Разблокировано! Теперь вы можете добавить до {unlock_level} квартир в бюро'
                })
            }

        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    except Exception as e:
        conn.rollback()
        print(f'Error: {e}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        cur.close()
        conn.close()
