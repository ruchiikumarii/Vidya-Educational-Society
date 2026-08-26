# Supabase Setup — Part 3 (Student Fees + Success Stories)

Run this once in Supabase → **SQL Editor** → paste → **Run**.
(Success story photos use the existing public `gallery` bucket — nothing new needed there.)

```sql
-- STUDENT FEES ---------------------------------------------------
create table public.fees (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  total_amount numeric not null default 0,
  paid_amount numeric not null default 0,
  next_due_date date,
  note text,
  updated_at timestamptz default now()
);
alter table public.fees enable row level security;

create policy "student reads own fees" on public.fees for select using (student_id = auth.uid());
create policy "admin manage fees" on public.fees for all
  using (public.is_admin()) with check (public.is_admin());

-- SUCCESS STORIES (public read so the website can show them) ------
create table public.success_stories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  course text,
  story text not null,
  image_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);
alter table public.success_stories enable row level security;

create policy "anyone read stories" on public.success_stories for select using (true);
create policy "admin add stories" on public.success_stories for insert with check (public.is_admin());
create policy "admin delete stories" on public.success_stories for delete using (public.is_admin());
```

## What you get
- **Admin dashboard → Fees tab:** set each student's Total, Paid, Next Due (Pending auto-calculated).
- **Student dashboard → Fees tab:** student sees Total / Paid / Pending / Next Due.
- **Admin dashboard → Success Stories tab:** add a student's story (name, course, story, optional photo).
- Added stories appear in a **Success Stories** section on the website home page automatically.
