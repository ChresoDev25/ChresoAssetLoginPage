-- Secure Auth Migration for Chreso University
-- Run this in the Supabase SQL Editor

-- 1. Create a table for profiles (optional but recommended for role management)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text not null check (role in ('admin', 'staff')),
  created_at timestamptz default now()
);

-- 2. Domain Lockdown Function
create or replace function public.validate_university_domain()
returns trigger
language plpgsql
security definer
as $$
declare
  allowed_domain text := 'chresouniversity.edu.zm';
  admin_email_1 text := 'chresouniversity2@gmail.com';
  admin_email_2 text := 'datacenter@chresouniversity.edu.zm';
  user_email text;
begin
  user_email := new.email;
  
  -- Allow whitelist admins
  if user_email = admin_email_1 or user_email = admin_email_2 then
    return new;
  end if;

  -- Check domain
  if split_part(user_email, '@', 2) != allowed_domain then
    raise exception 'Access Denied: Only @chresouniversity.edu.zm emails are allowed.';
  end if;

  return new;
end;
$$;

-- 3. Trigger for new user creation
drop trigger if exists check_university_domain on auth.users;
create trigger check_university_domain
  before insert on auth.users
  for each row execute function public.validate_university_domain();

-- 4. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
    user_role text;
begin
    -- Assign Admin role to whitelisted emails
    if new.email = 'chresouniversity2@gmail.com' or new.email = 'datacenter@chresouniversity.edu.zm' then
        user_role := 'admin';
    else
        user_role := 'staff';
    end if;

    insert into public.profiles (id, email, role)
    values (new.id, new.email, user_role);
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Row Level Security for Profiles
alter table public.profiles enable row level security;

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
      exists (
          select 1 from public.profiles
          where id = auth.uid() and role = 'admin'
      )
  );

create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );
