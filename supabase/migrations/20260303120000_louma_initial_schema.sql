-- Louma — schéma utilisateur (Auth + données sync)
-- Exécuter dans Supabase → SQL Editor si le MCP n'est pas lié au projet.

create extension if not exists "pgcrypto";

-- ─── Profiles ───────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ─── Préférences (JSONB) ────────────────────────────────────────────────────

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  prefs jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

drop policy if exists "user_preferences_select_own" on public.user_preferences;
drop policy if exists "user_preferences_insert_own" on public.user_preferences;
drop policy if exists "user_preferences_update_own" on public.user_preferences;

create policy "user_preferences_select_own" on public.user_preferences
  for select using (auth.uid() = user_id);
create policy "user_preferences_insert_own" on public.user_preferences
  for insert with check (auth.uid() = user_id);
create policy "user_preferences_update_own" on public.user_preferences
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── Favoris unifiés ────────────────────────────────────────────────────────

create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('quran', 'hadith', 'dua')),
  ref_key text not null,
  metadata jsonb not null default '{}'::jsonb,
  added_at timestamptz not null default now(),
  unique (user_id, kind, ref_key)
);

create index if not exists user_favorites_user_kind_idx
  on public.user_favorites (user_id, kind);

alter table public.user_favorites enable row level security;

drop policy if exists "user_favorites_select_own" on public.user_favorites;
drop policy if exists "user_favorites_insert_own" on public.user_favorites;
drop policy if exists "user_favorites_update_own" on public.user_favorites;
drop policy if exists "user_favorites_delete_own" on public.user_favorites;

create policy "user_favorites_select_own" on public.user_favorites
  for select using (auth.uid() = user_id);
create policy "user_favorites_insert_own" on public.user_favorites
  for insert with check (auth.uid() = user_id);
create policy "user_favorites_update_own" on public.user_favorites
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_favorites_delete_own" on public.user_favorites
  for delete using (auth.uid() = user_id);

-- ─── Progression Apprendre ──────────────────────────────────────────────────

create table if not exists public.lesson_completions (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id text not null,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, course_id, lesson_id)
);

alter table public.lesson_completions enable row level security;

drop policy if exists "lesson_completions_select_own" on public.lesson_completions;
drop policy if exists "lesson_completions_insert_own" on public.lesson_completions;
drop policy if exists "lesson_completions_delete_own" on public.lesson_completions;

create policy "lesson_completions_select_own" on public.lesson_completions
  for select using (auth.uid() = user_id);
create policy "lesson_completions_insert_own" on public.lesson_completions
  for insert with check (auth.uid() = user_id);
create policy "lesson_completions_delete_own" on public.lesson_completions
  for delete using (auth.uid() = user_id);

-- ─── État Coran ─────────────────────────────────────────────────────────────

create table if not exists public.quran_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  last_read jsonb,
  last_listen jsonb,
  recent_suras jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.quran_state enable row level security;

drop policy if exists "quran_state_select_own" on public.quran_state;
drop policy if exists "quran_state_insert_own" on public.quran_state;
drop policy if exists "quran_state_update_own" on public.quran_state;

create policy "quran_state_select_own" on public.quran_state
  for select using (auth.uid() = user_id);
create policy "quran_state_insert_own" on public.quran_state
  for insert with check (auth.uid() = user_id);
create policy "quran_state_update_own" on public.quran_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── Outils (dhikr, sadaqa, objectif hebdo) ─────────────────────────────────

create table if not exists public.worship_tools (
  user_id uuid primary key references auth.users (id) on delete cascade,
  dhikr_count integer not null default 0,
  dhikr_daily_goal integer not null default 33,
  sadaqa_monthly_goal numeric,
  sadaqa_month_done jsonb,
  weekly_learning jsonb,
  updated_at timestamptz not null default now()
);

alter table public.worship_tools enable row level security;

drop policy if exists "worship_tools_select_own" on public.worship_tools;
drop policy if exists "worship_tools_insert_own" on public.worship_tools;
drop policy if exists "worship_tools_update_own" on public.worship_tools;

create policy "worship_tools_select_own" on public.worship_tools
  for select using (auth.uid() = user_id);
create policy "worship_tools_insert_own" on public.worship_tools
  for insert with check (auth.uid() = user_id);
create policy "worship_tools_update_own" on public.worship_tools
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── Prières cochées par jour ─────────────────────────────────────────────────

create table if not exists public.prayer_daily_log (
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  prayers jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, log_date)
);

alter table public.prayer_daily_log enable row level security;

drop policy if exists "prayer_daily_log_select_own" on public.prayer_daily_log;
drop policy if exists "prayer_daily_log_insert_own" on public.prayer_daily_log;
drop policy if exists "prayer_daily_log_update_own" on public.prayer_daily_log;

create policy "prayer_daily_log_select_own" on public.prayer_daily_log
  for select using (auth.uid() = user_id);
create policy "prayer_daily_log_insert_own" on public.prayer_daily_log
  for insert with check (auth.uid() = user_id);
create policy "prayer_daily_log_update_own" on public.prayer_daily_log
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── Préférences notifications ──────────────────────────────────────────────

create table if not exists public.user_notification_prefs (
  user_id uuid primary key references auth.users (id) on delete cascade,
  prayer_enabled boolean not null default false,
  hadith_reminder_enabled boolean not null default false,
  lesson_reminder_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.user_notification_prefs enable row level security;

drop policy if exists "user_notification_prefs_select_own" on public.user_notification_prefs;
drop policy if exists "user_notification_prefs_insert_own" on public.user_notification_prefs;
drop policy if exists "user_notification_prefs_update_own" on public.user_notification_prefs;

create policy "user_notification_prefs_select_own" on public.user_notification_prefs
  for select using (auth.uid() = user_id);
create policy "user_notification_prefs_insert_own" on public.user_notification_prefs
  for insert with check (auth.uid() = user_id);
create policy "user_notification_prefs_update_own" on public.user_notification_prefs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── Trigger nouveau compte ─────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id) values (new.id) on conflict do nothing;
  insert into public.user_notification_prefs (user_id) values (new.id) on conflict do nothing;
  insert into public.worship_tools (user_id) values (new.id) on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Storage avatars ────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_insert_own" on storage.objects;
drop policy if exists "avatars_update_own" on storage.objects;
drop policy if exists "avatars_delete_own" on storage.objects;

create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_update_own" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_delete_own" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
