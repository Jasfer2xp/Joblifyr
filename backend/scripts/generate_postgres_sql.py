"""Generate PostgreSQL DDL from Django migrations (for Supabase SQL editor)."""
import os
import sys
from io import StringIO

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Force PostgreSQL backend before Django loads database connection.
os.environ['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/postgres'

import django
from django.core.management import call_command

django.setup()

MIGRATIONS = [
    ('contenttypes', '0001'),
    ('contenttypes', '0002'),
    ('auth', '0001'),
    ('auth', '0002'),
    ('auth', '0003'),
    ('auth', '0004'),
    ('auth', '0005'),
    ('auth', '0006'),
    ('auth', '0007'),
    ('auth', '0008'),
    ('auth', '0009'),
    ('auth', '0010'),
    ('auth', '0011'),
    ('auth', '0012'),
    ('users', '0001'),
    ('authentication', '0001'),
    ('jobs', '0001'),
    ('jobs', '0002'),
    ('admin', '0001'),
    ('admin', '0002'),
    ('admin', '0003'),
    ('sessions', '0001'),
]

out = StringIO()
for app, migration in MIGRATIONS:
    call_command('sqlmigrate', app, migration, stdout=out)

print(out.getvalue())
