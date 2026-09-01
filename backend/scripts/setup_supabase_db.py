#!/usr/bin/env python
"""Apply Django migrations to Supabase PostgreSQL and seed sample jobs."""
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
from django.core.management import call_command
from django.db import connection

django.setup()


def main():
    database_url = os.environ.get('DATABASE_URL', '').strip()
    if not database_url:
        print('ERROR: DATABASE_URL is not set in backend/.env')
        print('Get it from Supabase: Project Settings > Database > Connection string > URI')
        print('Example: postgresql://postgres:[PASSWORD]@db.zbyipjlwtlbbuqllxgxy.supabase.co:5432/postgres')
        sys.exit(1)

    print('Connecting to Supabase PostgreSQL...')
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT version();')
            version = cursor.fetchone()[0]
            print(f'Connected: {version[:60]}...')
    except Exception as exc:
        print(f'ERROR: Could not connect to database: {exc}')
        sys.exit(1)

    print('Running migrations...')
    call_command('migrate', interactive=False, verbosity=1)

    print('Seeding sample jobs...')
    call_command('seed_jobs', verbosity=1)

    print('Done. Tables created:')
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT tablename FROM pg_tables
            WHERE schemaname = 'public'
              AND (
                tablename LIKE 'users_%'
                OR tablename LIKE 'jobs_%'
                OR tablename LIKE 'authentication_%'
                OR tablename LIKE 'django_%'
                OR tablename LIKE 'auth_%'
              )
            ORDER BY tablename;
            """
        )
        for (name,) in cursor.fetchall():
            print(f'  - {name}')


if __name__ == '__main__':
    main()
