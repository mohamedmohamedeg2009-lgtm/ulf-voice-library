create extension if not exists pgcrypto;

create table public.voices (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 80),
  display_name text not null check (char_length(display_name) between 2 and 80),
  dialect text not null,
  country text not null,
  gender text not null default 'male' check (gender = 'male'),
  age_style text not null,
  voice_tone text not null,
  energy_level integer not null default 60 check (energy_level between 0 and 100),
  style_tags text[] not null default '{}',
  description text not null default '',
  preview_audio_url text,
  provider text not null,
  provider_voice_id text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_voice_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  description text not null default '' check (char_length(description) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recordings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  text text not null check (char_length(text) between 1 and 5000),
  voice_id uuid not null references public.voices(id) on delete restrict,
  voice_name text not null,
  settings jsonb not null default '{}'::jsonb,
  audio_url text,
  mp3_url text,
  wav_url text,
  duration numeric(10, 3) check (duration is null or duration >= 0),
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz not null default now(),
  check (audio_url is not null or mp3_url is not null or wav_url is not null)
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  voice_id uuid not null references public.voices(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (owner_id, voice_id)
);

create table public.app_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index recordings_owner_created_idx on public.recordings (owner_id, created_at desc);
create index recordings_project_idx on public.recordings (project_id) where project_id is not null;
create index projects_owner_updated_idx on public.projects (owner_id, updated_at desc);
create index favorites_owner_created_idx on public.favorites (owner_id, created_at desc);
create index voices_active_country_idx on public.voices (is_active, country);
create index voices_style_tags_idx on public.voices using gin (style_tags);

create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger voices_set_updated_at before update on public.voices
for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger app_settings_set_updated_at before update on public.app_settings
for each row execute function public.set_updated_at();

alter table public.voices enable row level security;
alter table public.projects enable row level security;
alter table public.recordings enable row level security;
alter table public.favorites enable row level security;
alter table public.app_settings enable row level security;

create policy "authenticated users read active voices" on public.voices
for select to authenticated using (is_active = true);

create policy "owners manage projects" on public.projects
for all to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "owners manage recordings" on public.recordings
for all to authenticated using ((select auth.uid()) = owner_id)
with check (
  (select auth.uid()) = owner_id
  and (project_id is null or exists (
    select 1 from public.projects p
    where p.id = project_id and p.owner_id = (select auth.uid())
  ))
);

create policy "owners manage favorites" on public.favorites
for all to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "owners manage app settings" on public.app_settings
for all to authenticated using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('voice-previews', 'voice-previews', true, 10485760, array['audio/mpeg', 'audio/wav', 'audio/x-wav']),
  ('generated-audio', 'generated-audio', false, 52428800, array['audio/mpeg', 'audio/wav', 'audio/x-wav'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads voice previews" on storage.objects
for select to public using (bucket_id = 'voice-previews');

create policy "owners read generated audio" on storage.objects
for select to authenticated using (
  bucket_id = 'generated-audio' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "owners upload generated audio" on storage.objects
for insert to authenticated with check (
  bucket_id = 'generated-audio' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "owners delete generated audio" on storage.objects
for delete to authenticated using (
  bucket_id = 'generated-audio' and (storage.foldername(name))[1] = (select auth.uid())::text
);
