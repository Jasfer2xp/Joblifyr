# Joblifyr — Supabase database setup

This app uses **Django ORM** (not Supabase Auth). Google sign-in is handled by the Django backend and users are stored in `users_joblifyruser`.

## 1. Get your Supabase connection string

1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/zbyipjlwtlbbuqllxgxy)
2. Go to **Project Settings → Database**
3. Copy the **URI** connection string (Transaction pooler or Direct)
4. Replace `[YOUR-PASSWORD]` with your database password

Example (direct):

```text
postgresql://postgres:[YOUR-PASSWORD]@db.zbyipjlwtlbbuqllxgxy.supabase.co:5432/postgres
```

Example (pooler, recommended for serverless):

```text
postgresql://postgres.zbyipjlwtlbbuqllxgxy:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

## 2. Set `DATABASE_URL` in `backend/.env`

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.zbyipjlwtlbbuqllxgxy.supabase.co:5432/postgres
DATABASE_SSLMODE=require
```

## 3. Create all tables

From the `backend/` folder:

```bash
python scripts/setup_supabase_db.py
```

Or manually:

```bash
python manage.py migrate
python manage.py seed_jobs
```

## Tables created for Google login

| Table | Purpose |
|-------|---------|
| `users_joblifyruser` | User accounts (`email`, `google_id`, `avatar_url`, `auth_provider`, …) |
| `authentication_pendingverification` | Email signup verification codes |
| `jobs_job` | Job listings |
| `jobs_jobapplication` | Job applications |
| `django_*`, `auth_*` | Django admin, permissions, sessions |

After migration, Google sign-in will create rows in `users_joblifyruser` with `auth_provider='google'`.

## Verify in Supabase

In **Table Editor**, you should see `users_joblifyruser`. After a successful Google login, a new row appears with the user's email and `google_id`.
