"""API для массового добавления объектов в сопровождение менеджера"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """Массовое добавление объектов в сопровождение менеджера"""
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
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
        listing_ids = body.get('listing_ids', [])
        
        if not manager_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указан manager_id'}),
                'isBase64Encoded': False
            }
        
        if not listing_ids or not isinstance(listing_ids, list):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Не указаны listing_ids'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = False
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Проверяем лимит менеджера
                cur.execute("""
                    SELECT object_limit FROM t_p39732784_hourly_rentals_platf.admins 
                    WHERE id = %s
                """, (manager_id,))
                manager = cur.fetchone()
                
                if not manager:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Менеджер не найден'}),
                        'isBase64Encoded': False
                    }
                
                # Проверяем текущее количество объектов
                cur.execute("""
                    SELECT COUNT(*) as count 
                    FROM t_p39732784_hourly_rentals_platf.manager_listings
                    WHERE manager_id = %s
                """, (manager_id,))
                current_count = cur.fetchone()['count']
                
                # Проверяем не превысит ли лимит
                if current_count + len(listing_ids) > manager['object_limit']:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'error': f'Превышен лимит объектов. Текущий: {current_count}, Лимит: {manager["object_limit"]}, Пытаетесь добавить: {len(listing_ids)}'
                        }),
                        'isBase64Encoded': False
                    }
                
                # Добавляем объекты
                added_count = 0
                skipped_count = 0
                
                for listing_id in listing_ids:
                    # Проверяем что объект не занят
                    cur.execute("""
                        SELECT id FROM t_p39732784_hourly_rentals_platf.manager_listings
                        WHERE listing_id = %s
                    """, (listing_id,))
                    
                    if cur.fetchone():
                        skipped_count += 1
                        continue
                    
                    # Добавляем объект
                    cur.execute("""
                        INSERT INTO t_p39732784_hourly_rentals_platf.manager_listings 
                            (manager_id, listing_id)
                        VALUES (%s, %s)
                    """, (manager_id, listing_id))
                    added_count += 1
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'added': added_count,
                        'skipped': skipped_count,
                        'total_now': current_count + added_count
                    }),
                    'isBase64Encoded': False
                }
                
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
            
    except Exception as e:
        import traceback
        print(f"[ERROR] {str(e)}")
        print(f"[TRACEBACK] {traceback.format_exc()}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
