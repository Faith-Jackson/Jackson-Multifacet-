-- schema.sql
-- Run this in your Supabase SQL Editor to create the necessary tables.

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  client_id uuid REFERENCES auth.users(id),
  status text DEFAULT 'planning',
  progress integer DEFAULT 0,
  description text
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  text text NOT NULL,
  sender_id uuid REFERENCES auth.users(id),
  sender_role text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.candidates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  status text DEFAULT 'pending_review',
  agreed boolean DEFAULT false,
  full_name text,
  email text,
  role text,
  raw_data jsonb
);

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  amount numeric NOT NULL,
  reference text UNIQUE,
  status text DEFAULT 'pending',
  purpose text,
  metadata jsonb
);

-- Turn on Realtime for tables
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.candidates;
alter publication supabase_realtime add table public.payments;

-- Set up Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-files', 'candidate-files', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('vault', 'vault', true) ON CONFLICT (id) DO NOTHING;
