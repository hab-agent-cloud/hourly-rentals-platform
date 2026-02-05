"""
Database privileges diagnostic script
Run this to investigate why SELECT fails on t_p39732784_hourly_rentals_platf.listings
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def main():
    # Get database connection from environment variable
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("ERROR: DATABASE_URL environment variable not set")
        return
    
    print(f"Connecting to database...")
    print(f"DATABASE_URL: {db_url[:30]}...")  # Print first 30 chars only for security
    print("-" * 80)
    
    conn = psycopg2.connect(db_url)
    
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Query 1: Check current database user
        print("\n1. CHECKING CURRENT DATABASE USER:")
        print("-" * 80)
        cur.execute("SELECT current_user, session_user")
        user_info = cur.fetchone()
        print(f"Current User: {user_info['current_user']}")
        print(f"Session User: {user_info['session_user']}")
        
        # Query 2: Check table privileges
        print("\n2. CHECKING TABLE PRIVILEGES FOR 'listings' TABLE:")
        print("-" * 80)
        cur.execute("""
            SELECT grantee, privilege_type 
            FROM information_schema.role_table_grants 
            WHERE table_schema = 't_p39732784_hourly_rentals_platf' 
            AND table_name = 'listings'
        """)
        privileges = cur.fetchall()
        
        if privileges:
            print(f"Found {len(privileges)} privilege grants:")
            for priv in privileges:
                print(f"  - Grantee: {priv['grantee']}, Privilege: {priv['privilege_type']}")
        else:
            print("NO PRIVILEGES FOUND in information_schema.role_table_grants!")
        
        # Query 3: Verify table exists in pg_tables
        print("\n3. VERIFYING TABLE EXISTS IN pg_tables:")
        print("-" * 80)
        cur.execute("""
            SELECT schemaname, tablename, tableowner 
            FROM pg_tables 
            WHERE schemaname = 't_p39732784_hourly_rentals_platf' 
            AND tablename = 'listings'
        """)
        table_info = cur.fetchone()
        
        if table_info:
            print(f"Table found in pg_tables:")
            print(f"  - Schema: {table_info['schemaname']}")
            print(f"  - Table: {table_info['tablename']}")
            print(f"  - Owner: {table_info['tableowner']}")
        else:
            print("Table NOT found in pg_tables!")
        
        # Query 4: Check schema privileges
        print("\n4. CHECKING SCHEMA PRIVILEGES:")
        print("-" * 80)
        cur.execute("""
            SELECT grantee, privilege_type 
            FROM information_schema.schema_privileges 
            WHERE schema_name = 't_p39732784_hourly_rentals_platf'
        """)
        schema_privs = cur.fetchall()
        
        if schema_privs:
            print(f"Found {len(schema_privs)} schema privilege grants:")
            for priv in schema_privs:
                print(f"  - Grantee: {priv['grantee']}, Privilege: {priv['privilege_type']}")
        else:
            print("NO schema privileges found!")
        
        # Query 5: Try the failing SELECT query
        print("\n5. ATTEMPTING THE FAILING SELECT QUERY:")
        print("-" * 80)
        try:
            cur.execute("SELECT * FROM t_p39732784_hourly_rentals_platf.listings WHERE id = 601")
            result = cur.fetchone()
            if result:
                print(f"SUCCESS! Query returned data for listing id=601")
            else:
                print("Query executed but no data found for id=601")
        except Exception as e:
            print(f"FAILED with error: {type(e).__name__}: {e}")
        
        # Query 6: Check table ACL directly from pg_class
        print("\n6. CHECKING TABLE ACL FROM pg_class:")
        print("-" * 80)
        cur.execute("""
            SELECT 
                n.nspname as schema_name,
                c.relname as table_name,
                c.relowner as owner_id,
                c.relacl as acl,
                pg_catalog.pg_get_userbyid(c.relowner) as owner_name
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 't_p39732784_hourly_rentals_platf'
            AND c.relname = 'listings'
        """)
        acl_info = cur.fetchone()
        
        if acl_info:
            print(f"Direct table information from pg_class:")
            print(f"  - Schema: {acl_info['schema_name']}")
            print(f"  - Table: {acl_info['table_name']}")
            print(f"  - Owner: {acl_info['owner_name']} (ID: {acl_info['owner_id']})")
            print(f"  - ACL: {acl_info['acl']}")
        
    conn.close()
    
    print("\n" + "=" * 80)
    print("DIAGNOSTIC COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    main()
