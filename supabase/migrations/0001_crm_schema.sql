-- CRM schema: companies/contacts/deals pipeline, tasks, notes, and the
-- profiles table that drives role-based access for the admin and client
-- dashboards. Run this once against the project referenced in .mcp.json
-- (Supabase Studio > SQL Editor, or `supabase db push` if you use the CLI).
--
-- This file was hardened after an adversarial audit found three critical
-- privilege-escalation paths in an earlier draft (forging an admin profile
-- via Supabase Auth's public signup endpoint, and a client self-promoting
-- via a direct `profiles` update). See the security notes inline below —
-- they explain *why* each control exists, not just what it does.

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

create type public.user_role as enum ('admin', 'staff', 'client');
create type public.deal_stage as enum ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- Generated + normalized so a unique index can dedupe case/whitespace
  -- variants ("Acme Inc" vs "acme inc ") without the app having to remember
  -- to normalize on every write path.
  name_norm text generated always as (lower(trim(name))) stored,
  domain text,
  industry text,
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index companies_name_norm_key on public.companies (name_norm);
create index companies_active_idx on public.companies (id) where archived_at is null;
create index companies_name_trgm_idx on public.companies using gin (name gin_trgm_ops);
create index companies_domain_trgm_idx on public.companies using gin (domain gin_trgm_ops);

-- One row per auth.users id. Created automatically by handle_new_user()
-- below whenever an auth user is created (self-service or admin-invited).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'client',
  full_name text,
  company_id uuid references public.companies (id) on delete set null,
  created_at timestamptz not null default now()
);
create index profiles_company_idx on public.profiles (company_id);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete set null,
  name text not null,
  email text not null,
  email_norm text generated always as (lower(trim(email))) stored,
  phone text,
  role text,
  notes text,
  source text not null default 'manual',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index contacts_email_norm_key on public.contacts (email_norm);
create index contacts_company_idx on public.contacts (company_id);
create index contacts_active_idx on public.contacts (id) where archived_at is null;
create index contacts_name_trgm_idx on public.contacts using gin (name gin_trgm_ops);
create index contacts_email_trgm_idx on public.contacts using gin (email gin_trgm_ops);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company_id uuid references public.companies (id) on delete set null,
  contact_id uuid references public.contacts (id) on delete set null,
  stage public.deal_stage not null default 'new',
  value numeric check (value is null or value >= 0),
  budget_range text,
  brief text,
  owner_id uuid references public.profiles (id) on delete set null,
  source text not null default 'manual',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index deals_company_idx on public.deals (company_id);
create index deals_contact_idx on public.deals (contact_id);
create index deals_stage_idx on public.deals (stage);
create index deals_owner_idx on public.deals (owner_id);
create index deals_active_idx on public.deals (id) where archived_at is null;
create index deals_title_trgm_idx on public.deals using gin (title gin_trgm_ops);
create index deals_brief_trgm_idx on public.deals using gin (brief gin_trgm_ops);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals (id) on delete cascade,
  title text not null,
  due_date date,
  completed boolean not null default false,
  assigned_to uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_deal_idx on public.tasks (deal_id);
-- Serves both the global tasks list's `order by completed, due_date` and an
-- "open, overdue-first" filtered view (`where not completed order by
-- due_date`) from the same composite index — no separate partial index.
create index tasks_completed_due_idx on public.tasks (completed, due_date);

-- Notes double as the client-facing "updates" feed: client_visible = true
-- rows are what a client sees in their dashboard for a deal.
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references public.deals (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  author_id uuid references public.profiles (id) on delete set null,
  body text not null,
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index notes_deal_idx on public.notes (deal_id);
-- Partial index matching the client dashboard's exact filter+sort shape
-- (`where client_visible order by created_at desc`) without indexing the
-- (much larger, over time) set of internal-only notes.
create index notes_client_visible_idx on public.notes (created_at desc) where client_visible;

-- Automatic history of deal-stage changes (distinct from `notes`, which is
-- manual commentary) — powers a "History" view on the deal detail page and
-- future time-in-stage / win-rate reporting. Only the trigger below writes
-- to it; no role can insert/update/delete it directly.
create table public.deal_stage_history (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals (id) on delete cascade,
  from_stage public.deal_stage,
  to_stage public.deal_stage not null,
  changed_by uuid references public.profiles (id) on delete set null,
  changed_at timestamptz not null default now()
);
create index deal_stage_history_deal_idx on public.deal_stage_history (deal_id, changed_at);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger companies_set_updated_at before update on public.companies
  for each row execute function public.set_updated_at();
create trigger contacts_set_updated_at before update on public.contacts
  for each row execute function public.set_updated_at();
create trigger deals_set_updated_at before update on public.deals
  for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();
create trigger notes_set_updated_at before update on public.notes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Automatic deal-stage history logging.
-- ---------------------------------------------------------------------------

create or replace function public.log_deal_stage_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'insert' or (tg_op = 'update' and new.stage is distinct from old.stage) then
    insert into public.deal_stage_history (deal_id, from_stage, to_stage, changed_by)
    values (new.id, case when tg_op = 'update' then old.stage else null end, new.stage, auth.uid());
  end if;
  return new;
end;
$$;

create trigger deals_log_stage_change
  after insert or update on public.deals
  for each row execute function public.log_deal_stage_change();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row for every new auth user.
--
-- SECURITY: role/company_id are read from raw_app_meta_data, never
-- raw_user_meta_data. raw_user_meta_data is exactly the `options.data`
-- object any caller can pass to Supabase Auth's PUBLIC signup endpoint
-- (reachable by anyone holding the anon key, which is necessarily public —
-- it ships in every page's JS bundle). Reading role/company_id from it was
-- a critical bug: `curl .../auth/v1/signup -d '{"data":{"role":"admin"}}'`
-- would have minted an admin account for anyone on the internet.
-- raw_app_meta_data can only be set via the service-role admin API
-- (auth.admin.createUser / updateUserById — see app/admin/actions.js's
-- createClientLogin), which end users can never reach directly.
--
-- Public self-signup (app/signup) never sets app_metadata, so it always
-- falls through to the 'client' default with no company. If this email
-- already exists as a contact tied to a company (e.g. they emailed in
-- through the site's contact form earlier), the profile is linked to that
-- company automatically — safe because sign-in (and therefore any
-- RLS-gated read) stays blocked until Supabase confirms the address, so
-- nobody can claim a company's data by typing an email they don't control.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_company_id uuid;
  matched_company_id uuid;
begin
  meta_company_id := nullif(new.raw_app_meta_data ->> 'company_id', '')::uuid;

  if meta_company_id is null then
    select company_id into matched_company_id
    from public.contacts
    where email_norm = lower(trim(new.email))
      and company_id is not null
    limit 1;
  end if;

  insert into public.profiles (id, role, full_name, company_id)
  values (
    new.id,
    coalesce((new.raw_app_meta_data ->> 'role')::public.user_role, 'client'),
    new.raw_user_meta_data ->> 'full_name',
    coalesce(meta_company_id, matched_company_id)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Role helpers (security definer so policies can check role/company without
-- recursively hitting profiles' own RLS). EXECUTE is explicit rather than
-- left at Postgres's create-time default (EXECUTE granted to PUBLIC), so
-- anon/authenticated can only call these through policy evaluation, not as
-- a direct RPC — defense in depth, not independently exploitable today
-- since each function only ever reports on the caller's own auth.uid() row.
-- ---------------------------------------------------------------------------

create or replace function public.current_role()
returns public.user_role
language sql security definer stable
set search_path = public
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

create or replace function public.current_company_id()
returns uuid
language sql security definer stable
set search_path = public
as $$
  select company_id from public.profiles where id = (select auth.uid());
$$;

create or replace function public.is_staff()
returns boolean
language sql security definer stable
set search_path = public
as $$
  select coalesce(
    (select role in ('admin', 'staff') from public.profiles where id = (select auth.uid())),
    false
  );
$$;

revoke execute on function public.current_role() from public;
revoke execute on function public.current_company_id() from public;
revoke execute on function public.is_staff() from public;
grant execute on function public.current_role() to authenticated;
grant execute on function public.current_company_id() to authenticated;
grant execute on function public.is_staff() to authenticated;

-- ---------------------------------------------------------------------------
-- Lead-capture upserts, called from lib/crm/captureLead.js via the
-- service-role client on every public contact-form submission.
--
-- Why RPC instead of the app doing select-then-insert: (1) atomic — no
-- race between two concurrent submissions both missing the "existing row"
-- check and inserting duplicates; (2) it's what makes the unique index on
-- *_norm actually get used as an upsert conflict target, instead of an
-- .ilike() call that Postgres cannot rewrite into an index lookup on
-- lower(email) (ILIKE isn't recognized as equivalent to a functional index
-- expression by the planner, even with no wildcards in the pattern).
--
-- Not security definer: the service-role Postgres role already bypasses
-- RLS, so these run with exactly the privilege the caller (captureLead.js's
-- admin client) already has — no need to escalate further. EXECUTE is
-- restricted to service_role only; anon/authenticated cannot call these.
-- ---------------------------------------------------------------------------

create or replace function public.upsert_company(p_name text)
returns table (id uuid)
language plpgsql
as $$
declare
  v_id uuid;
begin
  insert into public.companies (name)
  values (p_name)
  -- Only touch updated_at on conflict (not name) so a public form
  -- resubmission never silently overwrites an admin-corrected company name.
  on conflict (name_norm) do update set updated_at = now()
  returning companies.id into v_id;

  return query select v_id;
end;
$$;

create or replace function public.upsert_contact(p_name text, p_email text, p_company_id uuid, p_source text)
returns table (id uuid, company_id uuid)
language plpgsql
as $$
declare
  v_id uuid;
begin
  insert into public.contacts (name, email, company_id, source)
  values (p_name, p_email, p_company_id, coalesce(p_source, 'manual'))
  -- Preserve an existing company_id (e.g. one an admin manually assigned)
  -- rather than overwrite it; only fill it in if it was previously unset.
  on conflict (email_norm) do update
    set company_id = coalesce(public.contacts.company_id, excluded.company_id)
  returning contacts.id into v_id;

  return query select v_id, contacts.company_id from public.contacts where contacts.id = v_id;
end;
$$;

revoke execute on function public.upsert_company(text) from public;
revoke execute on function public.upsert_contact(text, text, uuid, text) from public;
grant execute on function public.upsert_company(text) to service_role;
grant execute on function public.upsert_contact(text, text, uuid, text) to service_role;

-- ---------------------------------------------------------------------------
-- Merge a duplicate company into another (e.g. "Acme Inc" vs "Acme
-- Incorporated" — near-dupes the unique name index won't itself catch).
-- Reassigns every dependent row, then deletes the source company. Callable
-- from the admin UI via supabase.rpc('merge_companies', {...}); the
-- is_staff() check inside makes it safe to grant to `authenticated` broadly.
-- ---------------------------------------------------------------------------

create or replace function public.merge_companies(source_id uuid, target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if source_id = target_id then
    raise exception 'source and target company must differ';
  end if;
  if not (select public.is_staff()) then
    raise exception 'not authorized';
  end if;

  update public.contacts set company_id = target_id where company_id = source_id;
  update public.deals set company_id = target_id where company_id = source_id;
  update public.profiles set company_id = target_id where company_id = source_id;

  delete from public.companies where id = source_id;
end;
$$;

revoke execute on function public.merge_companies(uuid, uuid) from public;
grant execute on function public.merge_companies(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Pipeline value rollup by stage. security_invoker means the view runs
-- with the CALLER's privileges (and therefore their RLS), not the view
-- owner's — without this a client querying the view would see every
-- company's aggregate rather than just their own, a cross-tenant leak.
-- Requires Postgres 15+ (Supabase's default for new projects).
-- ---------------------------------------------------------------------------

create view public.deal_pipeline_summary
with (security_invoker = true) as
select
  stage,
  count(*) as deal_count,
  count(*) filter (where value is not null) as valued_deal_count,
  sum(value) filter (where value is not null) as total_value
from public.deals
where archived_at is null
group by stage;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.deals enable row level security;
alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.deal_stage_history enable row level security;

-- profiles: everyone can read their own row; staff can read everyone
-- (needed to assign deals/tasks to teammates and to show client names).
create policy profiles_select_own on public.profiles
  for select using (id = (select auth.uid()) or (select public.is_staff()));

-- SECURITY: this policy's row check (id = own id) is intentionally paired
-- with a column-level GRANT below restricting *which* columns authenticated
-- can update at all. Without that grant, this policy alone would let any
-- signed-in user set their OWN role to 'admin' or company_id to any other
-- company's id via a plain `update profiles set role = 'admin' where id =
-- auth.uid()` — the row-level check only constrains *which row*, never
-- *which columns* of it, and RLS has no column-level concept of its own.
create policy profiles_update_own on public.profiles
  for update using (id = (select auth.uid())) with check (id = (select auth.uid()));

revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

-- Deliberately no staff/admin "manage all profiles" policy: no legitimate
-- app code path needs one (role/company_id assignment for client logins
-- goes through the service-role admin client in createClientLogin, which
-- bypasses RLS entirely and doesn't need a policy). A prior `for all using
-- (is_staff())` policy here was a critical bug — it let any 'staff' account
-- (not just 'admin') update or delete ANY profile, including self-promoting
-- to admin or deleting/hijacking other accounts, because the USING/WITH
-- CHECK only re-checked the *caller's* current role, never which row or
-- which new values were being written.

-- companies: staff full access; clients read only their own company.
create policy companies_staff_all on public.companies
  for all using ((select public.is_staff())) with check ((select public.is_staff()));
create policy companies_client_read on public.companies
  for select using (id = (select public.current_company_id()));

-- contacts: staff full access; clients read contacts at their own company.
create policy contacts_staff_all on public.contacts
  for all using ((select public.is_staff())) with check ((select public.is_staff()));
create policy contacts_client_read on public.contacts
  for select using (company_id = (select public.current_company_id()));

-- deals: staff full access; clients read only their own company's deals.
create policy deals_staff_all on public.deals
  for all using ((select public.is_staff())) with check ((select public.is_staff()));
create policy deals_client_read on public.deals
  for select using (company_id = (select public.current_company_id()));

-- tasks: staff only — internal to-dos, never shown to clients.
create policy tasks_staff_all on public.tasks
  for all using ((select public.is_staff())) with check ((select public.is_staff()));

-- notes: staff full access; clients read only notes explicitly marked
-- client_visible on a deal belonging to their company.
create policy notes_staff_all on public.notes
  for all using ((select public.is_staff())) with check ((select public.is_staff()));
create policy notes_client_read on public.notes
  for select using (
    client_visible
    and exists (
      select 1 from public.deals
      where deals.id = notes.deal_id
        and deals.company_id = (select public.current_company_id())
    )
  );

-- deal_stage_history: staff-only read; no insert/update/delete policy for
-- any role at all — only the security-definer trigger writes to it.
create policy deal_stage_history_staff_read on public.deal_stage_history
  for select using ((select public.is_staff()));
