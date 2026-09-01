# Joblifyr

Modern job marketplace monorepo.

## Stack

- **Frontend:** React + Vite + Tailwind (`frontend/`) — deployed on Vercel
- **Backend:** Django REST Framework (`backend/`) — deploy on Render/Railway/Fly.io
- **Database:** Supabase PostgreSQL

## Quick start

### Backend

```bash
cd backend
cp .env.example .env   # fill in secrets (especially DATABASE_URL)
pip install -r requirements.txt
python scripts/setup_supabase_db.py   # migrate + seed on Supabase
python manage.py runserver 8000
```

Supabase project: `https://zbyipjlwtlbbuqllxgxy.supabase.co` — see `supabase/README.md` for database setup.

### Frontend

```bash
cd frontend
cp .env.example .env   # optional for local dev
npm install
npm run dev
```

### Production

- **Vercel:** set `VITE_API_URL` to your Django backend URL
- **Backend `.env`:** set `DATABASE_URL`, `GOOGLE_*`, `FRONTEND_URL`, `BACKEND_URL`

## Project structure

```text
joblifyr/
├── frontend/     React application
├── backend/      Django REST API
├── vercel.json   Frontend deployment config
└── package.json  Root convenience scripts
```
