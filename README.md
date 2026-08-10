# Joblifyr Architecture Conversion & System Modernization Plan

> **Author**: Senior Full Stack Web Developer  
> **Target Stack**: **Django 5.x** (Backend & AI Engine) | **Next.js 14+** (App Router & API Endpoints) | **Tailwind CSS** (UI/UX Design System) | **Supabase** (PostgreSQL Database, Auth & Realtime)

---

## 1. Existing System Analysis & Audit

### 1.1 Legacy System Overview
The current Joblifyr codebase is a legacy PHP prototype transitioning towards a modern frontend. A detailed audit of the workspace reveals:

* **Entrypoint & Routing (`index.php`)**: A legacy PHP page using Bootstrap 5.3 CDN, custom CSS (`css/home.css`), and dynamic inline JS for a typewriter hero animation. Redirects to `/dist/` if a React bundle is present.
* **Authentication (`auth/login.php`, `auth/register.php`, `backend/register.php`, `classes/User.php`)**:
  * Registration writes raw hashed passwords to a single `users` table via PDO (`classes/User.php`).
  * Basic validation (email filter, minimum 8 characters).
  * Missing robust password reset, login execution handler (`auth/process_login.php` is missing/stubbed), and OAuth callback handlers for Google, LinkedIn, and X/Twitter.
  * Security risks: Vulnerable session handling, lack of token rotation, absence of Role-Based Access Control (RBAC).
* **Classes & Models (`classes/User.php`, `classes/Admin.php`)**: Minimal PHP classes with raw PDO dependency injection. Admin class contains uninitialized public attributes without RBAC rules.
* **Frontend Prototype (`resources/js/pages/App.jsx`, `resources/js/styles.css`)**:
  * React/Vite component with hardcoded sample job roles, categories, and talent profiles.
  * Styled with raw custom CSS (`styles.css`), implementing glassmorphism, hero roller animations, and responsive navigation.

### 1.2 Identified Functional Scope
1. **User Roles**: Job Seekers (Talent), Employers (Companies), Admins.
2. **Authentication & Identity**: Email/Password + Multi-provider OAuth (Google, LinkedIn, X/Twitter) with identity anti-collision safety.
3. **Job Marketplace**: Job search, filtering by work mode (Remote/Contract/Hybrid), salary ranges, job categories, and instant job posting.
4. **Talent & Freelance Directory**: Living candidate profiles, skill pills, hourly rates, availability toggles, review ratings, and 98% role alignment matching.
5. **Applications & Matching**: Resume submission, cover letters, application tracking (Pending, Reviewing, Accepted, Rejected), and automated match score calculation.
6. **Interaction Layer**: Saved jobs (bookmarks), direct messaging between employers and talent, notifications, and client/freelancer reviews.

---

## 2. High-Level Architecture Strategy

```
                          ┌──────────────────────────────────────────────────────────┐
                          │                   CLIENT (Browser / Mobile)              │
                          └────────────────────────────┬─────────────────────────────┘
                                                       │
                                            HTTP / WebSocket / HTTPS
                                                       │
                          ┌────────────────────────────▼─────────────────────────────┐
                          │               NEXT.JS 14+ FRONTEND & API GATEWAY         │
                          │   • Tailwind CSS Design System & React Server Components │
                          │   • API Routes (/app/api/*) & Server Actions             │
                          │   • Edge Auth Middleware & Session Handling              │
                          └──────────────┬───────────────────────────┬───────────────┘
                                         │                           │
                   Supabase JS Client    │                           │ REST API / JWT
                  (Data Queries & Auth)  │                           │ (Heavy Async/AI)
                                         ▼                           ▼
                          ┌──────────────────────────┐    ┌──────────────────────────┐
                          │     SUPABASE PLATFORM    │    │      DJANGO BACKEND      │
                          │  • PostgreSQL DB + RLS   │    │  • Matching Engine (AI)  │
                          │  • Supabase Auth         │    │  • Celery + Redis Tasks │
                          │  • Storage (Resumes/Media)│   │  • Django Admin Panel    │
                          │  • Realtime Subscriptions│    │  • Analytics & Audit Logs│
                          └──────────────────────────┘    └──────────────────────────┘
```

### Stack Responsibilities Breakdown
* **Next.js 14+ (App Router)**: Serves high-performance Server-Rendered (SSR) pages, handles client interactions with Tailwind CSS UI, and exposes unified Backend-For-Frontend (BFF) API routes (`/api/*`).
* **Tailwind CSS**: Modern utility-first CSS design system providing responsive layouts, dark/light themes, custom animations, and consistent component primitives.
* **Django 5.x (Python Backend)**: Serves complex business domain processing, AI matching score algorithms, background job queues (Celery/Redis), candidate PDF resume parsing, and administrative management via Django Admin.
* **Supabase (PostgreSQL)**: Serves as the primary database with native Row Level Security (RLS), OAuth authentication management, asset storage (resumes, avatars, logos), and real-time messaging capabilities.

---

## 3. Database Schema Design (Supabase PostgreSQL)

Below is the complete SQL DDL schema designed for execution in Supabase SQL Editor.

```sql
-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Roles ENUM
CREATE TYPE user_role AS ENUM ('job_seeker', 'employer', 'admin');

-- Job Types & Status ENUMs
CREATE TYPE job_work_mode AS ENUM ('remote', 'hybrid', 'on_site', 'contract');
CREATE TYPE job_status AS ENUM ('draft', 'published', 'filled', 'archived');
CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'shortlisted', 'accepted', 'rejected');

-------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Extends Supabase auth.users)
-------------------------------------------------------------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'job_seeker',
    avatar_url TEXT,
    headline TEXT,
    bio TEXT,
    location TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- 2. AUTH IDENTITIES (OAuth Collision Protection)
-------------------------------------------------------------------------------
CREATE TABLE public.auth_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'google', 'linkedin', 'twitter'
    provider_user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

-------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-------------------------------------------------------------------------------
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_symbol TEXT NOT NULL DEFAULT '⌘',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- 4. COMPANY PROFILES (For Employers)
-------------------------------------------------------------------------------
CREATE TABLE public.company_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    logo_url TEXT,
    website TEXT,
    tagline TEXT,
    description TEXT,
    location TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- 5. JOBS TABLE
-------------------------------------------------------------------------------
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.company_profiles(id) ON DELETE SET NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    work_mode job_work_mode NOT NULL DEFAULT 'remote',
    location TEXT,
    pay_min DECIMAL(10,2),
    pay_max DECIMAL(10,2),
    pay_unit TEXT DEFAULT 'hourly', -- 'hourly', 'monthly', 'yearly'
    description TEXT NOT NULL,
    requirements TEXT[],
    status job_status NOT NULL DEFAULT 'published',
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- 6. FREELANCER / TALENT PROFILES
-------------------------------------------------------------------------------
CREATE TABLE public.freelancer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hourly_rate DECIMAL(8,2),
    skills TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    rating_avg DECIMAL(3,2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    portfolio_links JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- 7. JOB APPLICATIONS TABLE
-------------------------------------------------------------------------------
CREATE TABLE public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    match_score INT DEFAULT 0, -- Calculated by Django AI Engine (e.g. 98%)
    status application_status NOT NULL DEFAULT 'pending',
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, applicant_id)
);

-------------------------------------------------------------------------------
-- 8. SAVED JOBS (Bookmarks)
-------------------------------------------------------------------------------
CREATE TABLE public.saved_jobs (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, job_id)
);

-------------------------------------------------------------------------------
-- 9. REVIEWS TABLE
-------------------------------------------------------------------------------
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- 10. CONVERSATIONS & MESSAGES (Realtime Capable)
-------------------------------------------------------------------------------
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_one UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    participant_two UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(participant_one, participant_two)
);

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public Profiles: Visible to everyone; editable by profile owner
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Jobs: Viewable by all; manageable by employer owner
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Employers can insert jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = employer_id);

-- Applications: Applicants view own; Employers view apps for their jobs
CREATE POLICY "Applicants view own applications" ON public.job_applications 
    FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Employers view applications for their jobs" ON public.job_applications 
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid()));

-------------------------------------------------------------------------------
-- AUTOMATIC PROFILE CREATION TRIGGER
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 4. Next.js 14 API Gateway & Endpoints Specification

Next.js App Router will host frontend components and serverless API endpoints in `app/api/*`.

### 4.1 Endpoints Table

| Endpoint | Method | Authentication | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Registers a new user with Supabase Auth & metadata |
| `/api/auth/login` | `POST` | Public | Authenticates credentials & sets HTTP-only JWT cookies |
| `/api/auth/logout` | `POST` | User | Invalidates session and clears tokens |
| `/api/auth/me` | `GET` | User | Returns authenticated profile data |
| `/api/jobs` | `GET` | Public | Lists jobs with pagination, filtering (category, pay, mode, search) |
| `/api/jobs` | `POST` | Employer | Creates a new job posting |
| `/api/jobs/[id]` | `GET` | Public | Fetches detailed job profile & metrics |
| `/api/jobs/[id]` | `PUT/DELETE`| Employer | Updates or archives job listing |
| `/api/jobs/[id]/apply` | `POST` | Job Seeker | Submits resume, cover letter & triggers Django match scoring |
| `/api/jobs/saved` | `GET/POST` | User | Fetches or toggles saved bookmarked jobs |
| `/api/talent` | `GET` | Public | Directory of hireable freelancers with filter by rate/skills |
| `/api/talent/[id]` | `GET` | Public | Fetches detailed freelancer portfolio & review metrics |
| `/api/categories` | `GET` | Public | Fetches job categories and active role counts |
| `/api/applications` | `GET` | User/Employer| Lists applications sent (seekers) or received (employers) |
| `/api/applications/[id]`| `PATCH` | Employer | Updates status (`shortlisted`, `accepted`, `rejected`) |

### 4.2 API Endpoint Payload Schema Example (`POST /api/jobs/[id]/apply`)

```json
// Request Body
{
  "resume_url": "https://[supabase-project].supabase.co/storage/v1/object/public/resumes/user_123.pdf",
  "cover_letter": "I am an experienced Frontend Engineer with 5+ years building React apps...",
  "portfolio_links": ["https://github.com/example", "https://myportfolio.com"]
}

// Response Body (201 Created)
{
  "success": true,
  "data": {
    "application_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "job_id": "4a2c91b1-5e8a-4d33-912f-7c181512f451",
    "status": "pending",
    "match_score": 98,
    "applied_at": "2026-08-10T09:30:00Z"
  }
}
```

---

## 5. Django Backend Service & Business Engine

The Django service operates as a microservice backend handling heavy computation, administrative tools, and automated tasks.

```
django_backend/
├── manage.py
├── core/                  # Project settings, WSGI/ASGI, URLs
│   ├── settings.py
│   ├── urls.py
│   └── supabase_client.py # Direct Supabase Service Role client
├── apps/
│   ├── matching/          # AI Match Engine (98% alignment algorithm)
│   │   ├── services.py    # Resume text extraction & TF-IDF/NLP match score
│   │   └── views.py
│   ├── analytics/         # Job view metrics & market trend aggregations
│   ├── notifications/     # Celery workers for Email (Resend/SendGrid) & push
│   └── user_management/   # Django Admin mirrors for Supabase tables
└── requirements.txt       # django, djangorestframework, celery, redis, supabase
```

### Key Responsibilities of Django Service:
1. **AI Candidate Alignment Engine**: When a user submits an application, Next.js calls Django's `/api/v1/calculate-match/` endpoint. Django downloads the resume PDF, parses skill embeddings against the job requirements array, and returns a calculated match percentage (e.g. `98%`).
2. **Celery Async Task Processing**: Runs background jobs for sending transaction emails, auditing stale job posts, and processing bulk notifications.
3. **Django Admin Interface**: Out-of-the-box internal administration portal for managing user accounts, verifying employers, moderating job listings, and viewing system telemetry.

---

## 6. Tailwind CSS UI/UX Design System

The application will feature a state-of-the-art visual aesthetic built with **Tailwind CSS**, dynamic animations (Framer Motion / Lucide icons), dark/light theme support, and responsive layouts.

### 6.1 Design Tokens (`tailwind.config.js`)
```javascript
/** @type {import('tailwind.config').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f3ff',
          100: '#ebe9fe',
          500: '#6366f1',
          600: '#4f46e5',
          900: '#312e81',
        },
        surface: {
          dark: '#0b0f19',
          cardDark: 'rgba(17, 24, 39, 0.7)',
          borderDark: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
```

### 6.2 Key UI Components Redesign Matrix

| Component | Legacy Codebase | Tailwind Next.js Redesign |
| :--- | :--- | :--- |
| **Hero Section** | Custom inline JS typewriter + Bootstrap grid (`index.php`) | Motion animated text roller, glassmorphic hero visual cards with live match badges (`App.jsx` conversion) |
| **Job Cards** | Raw HTML styling in static arrays | Glassmorphic card grid, dynamic status badges, hover scale effects, pay scale tags |
| **Auth Forms** | Basic form styling (`auth/register.php`) | Floating label inputs, real-time validation, multi-provider OAuth buttons (Google, LinkedIn, X) |
| **Categories Grid** | Static list | Interactive grid cards with custom symbols, open role counters, micro-transitions |
| **Mobile Menu** | Inline JS DOM manipulation | Animated slide-out drawer with blur backdrop and accessible focus traps |

---

## 7. Migration Roadmap & Execution Phases

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Supabase Database & Auth Setup                                          │
│   • Execute SQL DDL migrations to set up tables, RLS policies, and triggers      │
│   • Configure Supabase Auth providers (Email/Password, Google, LinkedIn, X)      │
│   • Create Supabase Storage buckets for 'resumes' and 'company-logos'            │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Next.js Frontend Framework & Tailwind CSS UI                            │
│   • Initialize Next.js 14 App Router project with Tailwind CSS & Lucide Icons     │
│   • Migrate landing page components from resources/js/pages/App.jsx              │
│   • Build UI pages: /jobs, /jobs/[id], /talent, /auth/login, /auth/register      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Next.js API Endpoints & Gateway                                         │
│   • Implement Next.js App Router API Routes (/app/api/*)                         │
│   • Connect Next.js API routes with Supabase Server Client                        │
│   • Add authentication & authorization middleware                                │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: Django Backend & Matching Engine                                        │
│   • Initialize Django project with Django REST Framework / Django Ninja          │
│   • Implement AI Candidate Alignment calculation algorithm                       │
│   • Set up Celery + Redis for asynchronous notification dispatch                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: Verification & Production Launch                                        │
│   • Perform end-to-end user flow testing (Registration -> Apply -> Match)        │
│   • Deploy Next.js to Vercel and Django Backend to Cloud Container Engine        │
│   • Verify security compliance, RLS rules, and performance metrics               │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Verification & Operational Commands

### Next.js & Frontend Development
```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Production build test
npm run build
```

### Django Backend Development
```bash
# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run migrations & start Django server
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

---
*Joblifyr Modernization Blueprint — Generated for high-scalability production deployment.*
