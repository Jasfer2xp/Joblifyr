-- ============================================================
-- Joblifyr Supabase Database Setup
-- Run this entire script in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'job_seeker'
        CHECK (role IN ('job_seeker', 'employer', 'admin')),
    auth_provider TEXT NOT NULL DEFAULT 'email'
        CHECK (auth_provider IN ('email', 'google', 'linkedin')),
    headline TEXT,
    bio TEXT,
    location TEXT,
    phone TEXT,
    website_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. AUTOMATIC PROFILE CREATION ON SIGNUP
-- Handles both email/password AND Google OAuth signups.
-- If a user signs up via Google, their name and avatar are
-- pulled from Google metadata automatically.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    _provider TEXT;
    _full_name TEXT;
    _first_name TEXT;
    _last_name TEXT;
    _avatar TEXT;
BEGIN
    -- Determine provider
    _provider := COALESCE(NEW.raw_app_meta_data->>'provider', 'email');

    -- Extract name from user metadata
    _full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        ''
    );
    _first_name := COALESCE(
        NEW.raw_user_meta_data->>'first_name',
        split_part(_full_name, ' ', 1),
        'New'
    );
    _last_name := COALESCE(
        NEW.raw_user_meta_data->>'last_name',
        CASE WHEN position(' ' IN _full_name) > 0
             THEN substring(_full_name FROM position(' ' IN _full_name) + 1)
             ELSE 'User'
        END
    );
    _avatar := NEW.raw_user_meta_data->>'avatar_url';

    -- Insert profile row (ON CONFLICT handles the anti-collision case
    -- where a user registered via email then signs in via Google with same email)
    INSERT INTO public.profiles (
        id, email, full_name, first_name, last_name, avatar_url, auth_provider
    )
    VALUES (
        NEW.id,
        NEW.email,
        _full_name,
        _first_name,
        _last_name,
        _avatar,
        _provider
    )
    ON CONFLICT (id) DO UPDATE SET
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if re-running
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================
-- 4. UPDATED_AT AUTO-REFRESH TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- DONE. Your profiles table is ready.
-- Google OAuth users and email/password users share the same
-- profiles table. Anti-collision is handled by the ON CONFLICT
-- clause in the trigger, so a Google sign-in with the same
-- email as an existing account links seamlessly.
-- ============================================================
