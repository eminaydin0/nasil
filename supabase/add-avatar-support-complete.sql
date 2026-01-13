-- 1. Add avatar_url to profiles (for admin/user management)
alter table public.profiles 
add column if not exists avatar_url text;

-- 2. Add avatar_url to comments (to display in game pages)
alter table public.comments 
add column if not exists avatar_url text;

-- 3. Note: For JSONB replies, we will handle it in the application code.
