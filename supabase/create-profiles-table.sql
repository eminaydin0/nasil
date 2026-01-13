-- Create a table for public profiles (synced with auth.users)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  birth_year text,
  gender text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policy: Allow anonymous read (since our Admin Panel runs as anon with simple password check)
-- WARNING: In a production app with sensitive data, you should use Supabase Auth for Admin and checking roles.
create policy "Enable read access for all users" on public.profiles
  for select using (true);

-- Policy: Users can update their own profile
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, birth_year, gender)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'birth_year',
    new.raw_user_meta_data->>'gender'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
