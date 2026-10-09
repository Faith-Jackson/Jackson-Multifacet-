-- Run this in your Supabase SQL Editor to set up the schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects Table
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  client_id uuid references auth.users(id),
  status text not null default 'planning',
  description text,
  progress integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Vault Files Table
create table if not exists vault_files (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  size text not null,
  category text not null,
  file_url text not null,
  uploaded_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages Table
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  sender_id uuid references auth.users(id),
  sender_role text not null,
  receiver_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table projects enable row level security;
alter table vault_files enable row level security;
alter table messages enable row level security;

-- Create policies for projects
create policy "Users can view their own projects or all if admin" on projects
  for select using (auth.uid() = client_id or (auth.jwt() ->> 'role') = 'admin');

-- Create policies for messages
create policy "Users can view their own messages" on messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id or (auth.jwt() ->> 'role') = 'admin');

create policy "Users can send messages" on messages
  for insert with check (auth.uid() = sender_id);
