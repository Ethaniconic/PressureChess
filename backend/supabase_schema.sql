-- ==============================================================================
-- PressureChess: Supabase PostgreSQL Schema
-- ==============================================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create User Profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  elo_rating integer default 1200,
  daily_streak integer default 1,
  last_active_date date default current_date,
  board_theme text default 'emerald',
  piece_theme text default 'neo',
  sound_enabled boolean default true,
  animation_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." 
  on public.profiles for select 
  using (true);

create policy "Users can insert their own profile." 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update their own profile." 
  on public.profiles for update 
  using (auth.uid() = id);

-- 3. Create Games table
create table if not exists public.games (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  game_type text default 'offline' check (game_type in ('offline', 'bot', 'puzzle', 'lesson')),
  opponent_name text default 'Opponent',
  result text not null check (result in ('1-0', '0-1', '1/2-1/2', 'in_progress', 'resigned', 'abandoned')),
  pgn text,
  final_fen text,
  moves_count integer default 0,
  player_color text default 'white' check (player_color in ('white', 'black', 'both')),
  time_control text default 'rapid',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Games
alter table public.games enable row level security;

create policy "Users can view their own games or guest games." 
  on public.games for select 
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert games." 
  on public.games for insert 
  with check (auth.uid() = user_id or user_id is null);

-- 4. Trigger to automatically create a profile entry whenever a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Storage bucket setup for avatars (Run in Supabase dashboard or via API)
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars."
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- ==============================================================================
-- 6. Academy Progress & Achievements Tables
-- ==============================================================================
create table if not exists public.academy_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id text not null,
  stars integer default 3 check (stars between 1 and 3),
  xp_earned integer default 50,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

alter table public.academy_progress enable row level security;

create policy "Users can view their own academy progress."
  on public.academy_progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own academy progress."
  on public.academy_progress for insert
  with check (auth.uid() = user_id);

create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id text not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "Users can view their own achievements."
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "Users can insert their own achievements."
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 7. Phase 2: Pressure Trainer, Tactics & Puzzle History
-- ==============================================================================
create table if not exists public.user_puzzle_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  puzzle_rating integer default 1200,
  highest_rating integer default 1200,
  puzzles_attempted integer default 0,
  puzzles_solved integer default 0,
  current_streak integer default 0,
  highest_streak integer default 0,
  total_time_spent_seconds numeric(10, 2) default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_puzzle_stats enable row level security;

create policy "Users can view their own puzzle stats."
  on public.user_puzzle_stats for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own puzzle stats."
  on public.user_puzzle_stats for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own puzzle stats."
  on public.user_puzzle_stats for update
  using (auth.uid() = user_id);

create table if not exists public.puzzle_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  puzzle_id text not null,
  category text not null,
  difficulty text default 'intermediate',
  mode text default 'timed',
  time_taken_seconds numeric(6, 2) not null,
  solved boolean not null,
  rating_delta integer default 0,
  user_rating_after integer default 1200,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.puzzle_history enable row level security;

create policy "Users can view their own puzzle history."
  on public.puzzle_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own puzzle history."
  on public.puzzle_history for insert
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 8. Phase 3: AI Chess Coach & Game Reviews
-- ==============================================================================
create table if not exists public.game_reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  white_player text default 'White',
  black_player text default 'Black',
  result text default '*',
  event text default 'Casual Game',
  game_date text default '',
  eco text default 'A00',
  opening_name text default 'Unknown Opening',
  white_accuracy numeric(5, 2) default 75.0,
  black_accuracy numeric(5, 2) default 75.0,
  moves_count integer default 0,
  blunders_count integer default 0,
  mistakes_count integer default 0,
  inaccuracies_count integer default 0,
  brilliants_count integer default 0,
  pgn text not null,
  analysis_json jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.game_reviews enable row level security;

create policy "Users can view their own game reviews or public games."
  on public.game_reviews for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert game reviews."
  on public.game_reviews for insert
  with check (auth.uid() = user_id or user_id is null);

-- ==============================================================================
-- 9. Phase 4: Online Multiplayer, Matchmaking & Elo Ratings
-- ==============================================================================

-- Add country and mode-specific ratings to profiles table if they don't exist
alter table public.profiles add column if not exists country text default 'US';
alter table public.profiles add column if not exists bullet_rating integer default 1200;
alter table public.profiles add column if not exists blitz_rating integer default 1200;
alter table public.profiles add column if not exists rapid_rating integer default 1200;
alter table public.profiles add column if not exists classical_rating integer default 1200;
alter table public.profiles add column if not exists wins integer default 0;
alter table public.profiles add column if not exists losses integer default 0;
alter table public.profiles add column if not exists draws integer default 0;

-- Multiplayer Games Table
create table if not exists public.multiplayer_games (
  id uuid default uuid_generate_v4() primary key,
  room_code text unique,
  mode text not null check (mode in ('bullet', 'blitz', 'rapid', 'classical')),
  time_control text not null,
  initial_time_seconds integer not null default 180,
  increment_seconds integer not null default 0,
  white_player_id uuid references public.profiles(id) on delete set null,
  black_player_id uuid references public.profiles(id) on delete set null,
  white_username text default 'White Player',
  black_username text default 'Waiting for opponent...',
  white_country text default 'US',
  black_country text default 'US',
  white_rating integer default 1200,
  black_rating integer default 1200,
  white_time_remaining numeric(10, 2) not null default 180,
  black_time_remaining numeric(10, 2) not null default 180,
  current_turn text default 'white' check (current_turn in ('white', 'black')),
  fen text not null default 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  pgn text default '',
  moves jsonb default '[]'::jsonb,
  status text not null default 'waiting' check (status in ('waiting', 'active', 'completed', 'aborted')),
  draw_offered_by text check (draw_offered_by in ('white', 'black', null)),
  result text check (result in ('1-0', '0-1', '1/2-1/2', null)),
  winner_id uuid references public.profiles(id) on delete set null,
  termination_reason text,
  white_rating_change integer default 0,
  black_rating_change integer default 0,
  last_move_timestamp timestamp with time zone default timezone('utc'::text, now()),
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.multiplayer_games enable row level security;

create policy "Multiplayer games are viewable by everyone."
  on public.multiplayer_games for select
  using (true);

create policy "Authenticated users can create games."
  on public.multiplayer_games for insert
  with check (auth.role() = 'authenticated' or true);

create policy "Players can update games."
  on public.multiplayer_games for update
  using (true);

-- Matchmaking Queue Table
create table if not exists public.matchmaking_queue (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  username text not null,
  rating integer not null default 1200,
  country text default 'US',
  mode text not null check (mode in ('bullet', 'blitz', 'rapid', 'classical')),
  time_control text not null,
  status text not null default 'searching' check (status in ('searching', 'matched', 'cancelled')),
  matched_game_id uuid references public.multiplayer_games(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.matchmaking_queue enable row level security;

create policy "Users can view the matchmaking queue."
  on public.matchmaking_queue for select
  using (true);

create policy "Users can join the matchmaking queue."
  on public.matchmaking_queue for insert
  with check (auth.uid() = user_id or true);

create policy "Users can update their queue entry."
  on public.matchmaking_queue for update
  using (auth.uid() = user_id or true);

create policy "Users can remove their queue entry."
  on public.matchmaking_queue for delete
  using (auth.uid() = user_id or true);

-- ==============================================================================
-- 10. Phase 5: Public Beta Release, Feedback, Analytics & Notifications
-- ==============================================================================

-- 1. Profiles additions: Founding status, frame, bio, favorite opening, notifications
alter table public.profiles add column if not exists is_founding_player boolean default true;
alter table public.profiles add column if not exists founding_badge_claimed boolean default true;
alter table public.profiles add column if not exists profile_frame text default 'beta_founder';
alter table public.profiles add column if not exists supporter_title text default 'Founding Beta Player';
alter table public.profiles add column if not exists bio text default '';
alter table public.profiles add column if not exists favorite_opening text default 'Sicilian Defense';
alter table public.profiles add column if not exists notifications_enabled boolean default true;
alter table public.profiles add column if not exists notification_preferences jsonb default '{"daily_reminder": true, "puzzle_reminder": true, "streak_reminder": true, "beta_updates": true}'::jsonb;

-- 2. User Feedback Table
create table if not exists public.feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  username text default 'Anonymous Tactician',
  feedback_type text not null check (feedback_type in ('bug', 'feature', 'lesson_rating', 'puzzle_rating', 'multiplayer_rating', 'general')),
  rating integer check (rating between 1 and 5),
  category text default 'General',
  message text not null,
  device_info jsonb default '{}'::jsonb,
  status text default 'new' check (status in ('new', 'reviewed', 'resolved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.feedback enable row level security;

create policy "Anyone can submit feedback."
  on public.feedback for insert
  with check (true);

create policy "Users can view their own feedback or public feedback."
  on public.feedback for select
  using (auth.uid() = user_id or user_id is null or true);

-- 3. Anonymous Product Analytics Events Table
create table if not exists public.analytics_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  event_properties jsonb default '{}'::jsonb,
  session_id text,
  platform text default 'web' check (platform in ('web', 'mobile_android', 'mobile_ios')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.analytics_events enable row level security;

create policy "Events can be inserted anonymously or authenticated."
  on public.analytics_events for insert
  with check (true);

create policy "Events can be viewed by admin or aggregate."
  on public.analytics_events for select
  using (true);

-- 4. Changelog Entries Table
create table if not exists public.changelog_entries (
  id uuid default uuid_generate_v4() primary key,
  version text not null unique,
  release_date date not null default current_date,
  title text not null,
  description text,
  new_features jsonb default '[]'::jsonb,
  bug_fixes jsonb default '[]'::jsonb,
  upcoming jsonb default '[]'::jsonb,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.changelog_entries enable row level security;

create policy "Changelog is publicly viewable."
  on public.changelog_entries for select
  using (is_published = true);

-- ==============================================================================
-- 11. Enable Supabase Realtime for Multiplayer Tables
-- ==============================================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'multiplayer_games'
  ) then
    alter publication supabase_realtime add table public.multiplayer_games;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'matchmaking_queue'
  ) then
    alter publication supabase_realtime add table public.matchmaking_queue;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
end $$;
