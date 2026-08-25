# Supabase Setup Guide — Student / Teacher / Admin Portal

Follow these steps once. After this, the Login + Dashboards on the website will work.
Total time: ~15–20 minutes. No coding needed — just copy & paste.

---

## STEP 1 — Create a Supabase account & project
1. Go to **https://supabase.com** → click **Start your project** → sign up (Google/GitHub, free).
2. Click **New project**.
   - **Name:** `vidya-neuron`
   - **Database Password:** choose a strong password and **save it somewhere** (you may need it later).
   - **Region:** choose **South Asia (Mumbai)** or **Singapore**.
   - Click **Create new project** and wait ~2 minutes.

---

## STEP 2 — Get your keys (give these to me / put in the app)
1. In your project, open **Settings** (gear icon) → **API**.
2. Copy these two values:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **anon public** key (a long text)
3. In the website project, make a file named **`.env`** (next to `package.json`) with:
   ```
   VITE_SUPABASE_URL="https://abcdxyz.supabase.co"
   VITE_SUPABASE_ANON_KEY="paste-the-anon-public-key-here"
   ```
   > ⚠️ On the same API page there is also a **service_role** key — that one is **secret**.
   > Never put it in `.env` or the website. It is only used inside the Edge Function (Step 6).

---

## STEP 3 — Create the database tables & security rules
1. In Supabase, open **SQL Editor** (left menu) → **New query**.
2. Paste **all** of the SQL below and click **Run**.

```sql
-- Roles
create type user_role as enum ('admin','teacher','student');

-- Profiles (one row per login)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  login_id text unique not null,
  full_name text not null,
  role user_role not null default 'student',
  valid_until date,               -- only used for students; null = no expiry
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- Notes / study material
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  teacher_name text not null,
  title text not null,
  description text,
  link_url text,
  file_path text,
  file_name text,
  created_at timestamptz default now()
);
alter table public.notes enable row level security;

-- Helper: is the current user an admin? (bypasses RLS safely)
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Helper: is the current user active (not expired)?
create or replace function public.is_active()
returns boolean language sql security definer stable as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid() and (valid_until is null or valid_until >= current_date)
  );
$$;

-- Profiles: rules
create policy "read own profile"  on public.profiles for select using (id = auth.uid());
create policy "admin read all"    on public.profiles for select using (public.is_admin());
create policy "admin manage all"  on public.profiles for all    using (public.is_admin()) with check (public.is_admin());

-- Notes: rules
create policy "active users read notes" on public.notes for select using (public.is_active());
create policy "teacher adds own notes"  on public.notes for insert with check (teacher_id = auth.uid());
create policy "teacher edits own notes" on public.notes for update using (teacher_id = auth.uid());
create policy "teacher/admin delete"    on public.notes for delete using (teacher_id = auth.uid() or public.is_admin());
```

---

## STEP 4 — Create the file storage (for PDFs / files)
1. Open **Storage** (left menu) → **New bucket**.
   - **Name:** `notes`
   - **Public bucket:** keep it **OFF** (private).
   - Click **Save**.
2. Now open **SQL Editor** → **New query**, paste this and **Run** (storage rules):

```sql
-- Teachers/admins can upload; everyone active can view; owners/admin can delete.
create policy "read note files" on storage.objects for select
  using (bucket_id = 'notes' and public.is_active());

create policy "upload note files" on storage.objects for insert
  with check (
    bucket_id = 'notes'
    and exists(select 1 from public.profiles where id = auth.uid() and role in ('teacher','admin'))
  );

create policy "delete note files" on storage.objects for delete
  using (bucket_id = 'notes' and auth.uid() is not null);
```

---

## STEP 5 — Create your first ADMIN login
1. Open **Authentication** (left menu) → **Users** → **Add user** → **Create new user**.
   - **Email:** `admin@vidyaneuron.local`
   - **Password:** choose an admin password (remember it)
   - Turn **Auto Confirm User: ON**
   - Click **Create user**.
2. Open **SQL Editor** → **New query**, paste this and **Run** (links that user as admin):

```sql
insert into public.profiles (id, login_id, full_name, role)
select id, 'admin', 'Administrator', 'admin'
from auth.users where email = 'admin@vidyaneuron.local';
```

> Now the admin logs into the website with **Login ID: `admin`** and the password you set.
> (The website adds `@vidyaneuron.local` behind the scenes.)

---

## STEP 6 — Deploy the Edge Function (so admin can create logins)
This is the small server piece that safely creates teacher/student logins.

**Easiest way (dashboard):**
1. Open **Edge Functions** (left menu) → **Create a function**.
2. Name it exactly: **`admin-users`**
3. Delete the sample code, and **paste the full code** from the file
   `supabase/functions/admin-users/index.ts` (in the website project).
4. Click **Deploy**.

That's it — Supabase automatically gives the function its `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY`, so no extra secrets to set.

> (Advanced/CLI alternative: `npx supabase functions deploy admin-users` after `supabase link`.)

---

## STEP 7 — Done! Test it
1. Restart the website dev server (`npm run dev`) so it reads the new `.env`.
2. Go to **/login**, log in as **admin** → you should see the **Admin Dashboard**.
3. Create a **teacher** and a **student** (set the student's *Valid Until* date).
4. Log out, log in as the **teacher** → add a note with a PDF.
5. Log out, log in as the **student** → you should see and download the note.
6. Set the student's *Valid Until* to a past date → that student can no longer log in.

---

## What to give me
Just tell me once **Steps 1–6 are done**. If anything shows an error, copy the
message to me and I'll fix it. You do **not** need to share the service_role key.
