-- Create a table to track user likes on comments
create table if not exists public.comment_likes (
  user_id uuid references auth.users not null,
  comment_id bigint references public.comments not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, comment_id)
);

-- Enable RLS
alter table public.comment_likes enable row level security;

-- Policies
create policy "Users can view their own likes" on public.comment_likes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own likes" on public.comment_likes
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own likes" on public.comment_likes
  for delete using (auth.uid() = user_id);

-- Note: We are NOT using a trigger to auto-increment counts to keep the logic similar for Guest vs User
-- Guests will just update the count directly and use localStorage
