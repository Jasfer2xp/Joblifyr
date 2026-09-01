"""Try Supabase pooler regions until one connects, then run migrations."""
import os
import sys
from io import StringIO
from pathlib import Path
from urllib.parse import quote, urlparse

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from dotenv import load_dotenv

load_dotenv(BASE_DIR / '.env')

password = os.environ.get('SUPABASE_DB_PASSWORD', '')
project_ref = 'zbyipjlwtlbbuqllxgxy'

if not password:
    parsed = urlparse(os.environ.get('DATABASE_URL', ''))
    password = parsed.password or ''

if not password:
    print('ERROR: Set DATABASE_URL or SUPABASE_DB_PASSWORD in backend/.env')
    sys.exit(1)

encoded_password = quote(password, safe='')
regions = [
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'ap-northeast-2',
    'us-east-1',
    'us-west-1',
    'eu-west-1',
    'eu-central-1',
]

connected_url = None
import psycopg2

for region in regions:
    host = f'aws-0-{region}.pooler.supabase.com'
    user = f'postgres.{project_ref}'
    for port in (6543, 5432):
        try:
            conn = psycopg2.connect(
                host=host,
                port=port,
                user=user,
                password=password,
                dbname='postgres',
                sslmode='require',
                connect_timeout=12,
            )
            conn.close()
            connected_url = (
                f'postgresql://{user}:{encoded_password}@{host}:{port}/postgres'
            )
            print(f'Connected via pooler ({region}, port {port})')
            break
        except Exception:
            continue
    if connected_url:
        break

if not connected_url:
    # Fallback: direct host IPv6 from DNS
    host = 'db.zbyipjlwtlbbuqllxgxy.supabase.co'
    try:
        conn = psycopg2.connect(
            host=host,
            port=5432,
            user='postgres',
            password=password,
            dbname='postgres',
            sslmode='require',
            connect_timeout=12,
        )
        conn.close()
        connected_url = f'postgresql://postgres:{encoded_password}@{host}:5432/postgres'
        print('Connected via direct host')
    except Exception as exc:
        print(f'ERROR: Could not connect to Supabase: {exc}')
        sys.exit(1)

# Persist working URL for Django
env_path = BASE_DIR / '.env'
text = env_path.read_text(encoding='utf-8')
lines = []
replaced = False
for line in text.splitlines():
    if line.startswith('DATABASE_URL='):
        lines.append(f'DATABASE_URL={connected_url}')
        replaced = True
    else:
        lines.append(line)
if not replaced:
    lines.append(f'DATABASE_URL={connected_url}')
env_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')

os.environ['DATABASE_URL'] = connected_url
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
from django.core.management import call_command
from django.db import connection

django.setup()

print('Running migrations...')
call_command('migrate', interactive=False, verbosity=1)
print('Seeding sample jobs...')
call_command('seed_jobs', verbosity=1)

with connection.cursor() as cursor:
    cursor.execute(
        """
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename IN ('users_joblifyruser', 'jobs_job', 'authentication_pendingverification')
        ORDER BY tablename
        """
    )
    tables = [row[0] for row in cursor.fetchall()]

print('Done. Key tables:', ', '.join(tables) if tables else '(none found)')
