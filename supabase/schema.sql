-- Gestion-Projet-AI : schema de référence Supabase
-- Ce fichier n'est PAS une migration exécutée. Le déployer uniquement après
-- sélection explicite du projet Supabase et génération d'une migration CLI.
-- Tables privées : chaque ligne appartient à auth.uid().

create extension if not exists pgcrypto;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  original_filename text not null,
  subject_label text,
  level_label text check (level_label is null or level_label in ('L1','L2','L3')),
  course_label text,
  classification_status text not null default 'needs_review'
    check (classification_status in ('suggested','confirmed','needs_review')),
  visibility text not null default 'private' check (visibility = 'private'),
  current_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id)
);

create table if not exists public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  storage_key text not null unique,
  mime_type text not null check (mime_type = 'application/pdf'),
  file_size bigint not null check (file_size > 0 and file_size <= 12582912),
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
  page_count integer not null default 0 check (page_count >= 0),
  extracted_character_count integer not null default 0 check (extracted_character_count >= 0),
  extraction_status text not null default 'pending'
    check (extraction_status in ('pending','processing','completed','partial','failed')),
  index_status text not null default 'pending'
    check (index_status in ('pending','processing','completed','failed')),
  ocr_status text not null default 'not_needed'
    check (ocr_status in ('not_needed','required','processing','completed','failed')),
  failure_code text,
  failure_message text,
  imported_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (document_id, version_number),
  unique (id, document_id, owner_id),
  foreign key (document_id, owner_id) references public.documents(id, owner_id) on delete cascade
);

alter table public.documents
  drop constraint if exists documents_current_version_fk;
alter table public.documents
  add constraint documents_current_version_fk
  foreign key (current_version_id, id, owner_id)
  references public.document_versions(id, document_id, owner_id)
  deferrable initially deferred;

create table if not exists public.document_passages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  version_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  passage_index integer not null check (passage_index >= 0),
  page_number integer check (page_number is null or page_number > 0),
  section_heading text,
  content text not null check (length(content) > 0),
  content_hash text not null,
  search_vector tsvector generated always as
    (to_tsvector('simple', coalesce(section_heading,'') || ' ' || content)) stored,
  created_at timestamptz not null default now(),
  unique (version_id, passage_index),
  foreign key (version_id, document_id, owner_id)
    references public.document_versions(id, document_id, owner_id) on delete cascade
);

create index if not exists document_passages_search_idx
  on public.document_passages using gin(search_vector);
create index if not exists document_passages_owner_idx
  on public.document_passages(owner_id, document_id, version_id);
create index if not exists document_versions_sha_idx
  on public.document_versions(owner_id, sha256);

create table if not exists public.project_workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  objective text not null default '',
  currency_code text not null default 'DJF',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_workspaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid,
  wbs_code text not null,
  name text not null,
  deliverable text,
  responsible text,
  start_date date,
  end_date date,
  progress numeric(5,2) not null default 0 check (progress between 0 and 100),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, wbs_code),
  foreign key (project_id, owner_id) references public.project_workspaces(id, owner_id) on delete cascade,
  foreign key (parent_id) references public.project_tasks(id) on delete set null,
  check (end_date is null or start_date is null or end_date >= start_date)
);
create unique index if not exists project_tasks_id_project_owner_idx
  on public.project_tasks(id, project_id, owner_id);

create table if not exists public.project_raci (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_workspaces(id) on delete cascade,
  task_id uuid not null references public.project_tasks(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  role_name text not null,
  responsibility char(1) not null check (responsibility in ('R','A','C','I')),
  created_at timestamptz not null default now(),
  unique (task_id, role_name),
  foreign key (project_id, owner_id) references public.project_workspaces(id, owner_id) on delete cascade
);

create table if not exists public.project_budget_lines (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  description text not null,
  planned_amount numeric(14,2) not null default 0 check (planned_amount >= 0),
  actual_amount numeric(14,2) not null default 0 check (actual_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (project_id, owner_id) references public.project_workspaces(id, owner_id) on delete cascade
);

create table if not exists public.project_risks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  risk_event text not null,
  probability integer not null check (probability between 1 and 5),
  impact integer not null check (impact between 1 and 5),
  response_plan text not null default '',
  responsible text,
  status text not null default 'open' check (status in ('open','in_progress','treated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (project_id, owner_id) references public.project_workspaces(id, owner_id) on delete cascade
);

-- RLS activée partout ; pas de politiques anon.
do $$
declare t text;
begin
  foreach t in array array[
    'documents','document_versions','document_passages','project_workspaces',
    'project_tasks','project_raci','project_budget_lines','project_risks'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()))',
      t || '_owner_all', t
    );
  end loop;
end $$;

-- Data API exposure is explicit; RLS remains the row-level boundary.
grant usage on schema public to authenticated;

-- Private bucket. Objects must be stored under <auth.uid()>/<document-id>/<version-id>.pdf
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gpai-documents', 'gpai-documents', false, 12582912, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 12582912,
  allowed_mime_types = array['application/pdf'];

create policy "gpai_documents_read_own"
on storage.objects for select to authenticated
using (bucket_id = 'gpai-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "gpai_documents_insert_own"
on storage.objects for insert to authenticated
with check (bucket_id = 'gpai-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "gpai_documents_update_own"
on storage.objects for update to authenticated
using (bucket_id = 'gpai-documents' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'gpai-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "gpai_documents_delete_own"
on storage.objects for delete to authenticated
using (bucket_id = 'gpai-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
