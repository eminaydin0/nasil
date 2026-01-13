-- Add avatar_url to profiles table
alter table public.profiles 
add column if not exists avatar_url text;

-- Update the handle_new_user function to include avatar_url sync if needed
-- But since that trigger is for INSERT on auth.users, and new users might not have avatar yet, 
-- we mainly need a way to sync updates.
-- For now, the client will update both tables.

-- Allow public read access to avatar_url (already covered by "Enable read access for all users")
