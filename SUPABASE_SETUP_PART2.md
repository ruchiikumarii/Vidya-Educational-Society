# Supabase Setup — Part 2 (Announcements, Assignments, Timetable, Gallery)

Do this once, after Part 1. Copy & paste — no coding.

---

## STEP A — Create the new tables & rules
Supabase → **SQL Editor** → **New query** → paste all of this → **Run**.

```sql
-- ANNOUNCEMENTS -------------------------------------------------
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null,
  audience text not null default 'all',      -- 'all' | 'students' | 'teachers'
  title text not null,
  body text,
  created_at timestamptz default now()
);
alter table public.announcements enable row level security;
create policy "read announcements" on public.announcements for select using (public.is_active());
create policy "staff add announcements" on public.announcements for insert
  with check (author_id = auth.uid()
    and exists(select 1 from public.profiles where id = auth.uid() and role in ('teacher','admin')));
create policy "author/admin delete announcements" on public.announcements for delete
  using (author_id = auth.uid() or public.is_admin());

-- ASSIGNMENTS ---------------------------------------------------
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  teacher_name text not null,
  title text not null,
  description text,
  file_path text,
  file_name text,
  due_date date,
  created_at timestamptz default now()
);
alter table public.assignments enable row level security;
create policy "read assignments" on public.assignments for select using (public.is_active());
create policy "teacher add assignments" on public.assignments for insert with check (teacher_id = auth.uid());
create policy "teacher/admin delete assignments" on public.assignments for delete
  using (teacher_id = auth.uid() or public.is_admin());

-- TIMETABLE -----------------------------------------------------
create table public.timetable (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  time_slot text not null,
  subject text not null,
  teacher_name text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.timetable enable row level security;
create policy "read timetable" on public.timetable for select using (public.is_active());
create policy "staff add timetable" on public.timetable for insert
  with check (exists(select 1 from public.profiles where id = auth.uid() and role in ('teacher','admin')));
create policy "staff delete timetable" on public.timetable for delete
  using (exists(select 1 from public.profiles where id = auth.uid() and role in ('teacher','admin')));

-- GALLERY (public read so website visitors can see) -------------
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  category text not null default 'Events',
  caption text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.gallery_items enable row level security;
create policy "anyone read gallery" on public.gallery_items for select using (true);
create policy "admin add gallery" on public.gallery_items for insert with check (public.is_admin());
create policy "admin delete gallery" on public.gallery_items for delete using (public.is_admin());
```

---

## STEP B — Create the public "gallery" storage bucket
1. Supabase → **Storage** → **New bucket**
   - **Name:** `gallery`
   - **Public bucket: ON** ✅ (so website visitors can see the photos)
   - **Save**
2. Then **SQL Editor** → **New query** → paste this → **Run**:

```sql
create policy "public read gallery files" on storage.objects for select
  using (bucket_id = 'gallery');
create policy "admin upload gallery files" on storage.objects for insert
  with check (bucket_id = 'gallery' and public.is_admin());
create policy "admin delete gallery files" on storage.objects for delete
  using (bucket_id = 'gallery' and public.is_admin());
```

> Assignment files reuse the existing private **`notes`** bucket — nothing extra needed for them.

---

## Done — what you now have
- **Admin dashboard tabs:** Users · Announcements · Timetable · Gallery
- **Teacher dashboard tabs:** Notes · Assignments · Announcements · Timetable
- **Student dashboard tabs:** Notes · Assignments · Announcements · Timetable
- Photos added from **Admin → Gallery** appear automatically on the website's public **Gallery** page.

No edge-function redeploy is needed for these features. Just restart the dev server if it was running.
