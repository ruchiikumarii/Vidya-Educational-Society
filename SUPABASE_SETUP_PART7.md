# Supabase Setup — Part 7 (Course & Institute Ratings)

This adds **star ratings and reviews**:

- an **overall institute rating** shown on the Home page, and
- a **per-course rating** shown on every course card and course detail page.

Both **logged-in students** (from their dashboard) and **website visitors** (from the
Home page) can leave a review. **Nothing appears on the website until the admin approves it.**

> Already ran an earlier version of this file? Just run the whole block again — every
> statement below is safe to re-run.

Run this in Supabase → **SQL Editor** → paste → **Run**.

```sql
-- REVIEWS ---------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  student_id   uuid references public.profiles(id) on delete cascade,  -- null = website visitor
  student_name text not null,
  login_id     text,
  course_slug  text,                 -- null  =  overall institute rating
  course_title text,
  rating       int  not null check (rating between 1 and 5),
  review       text,
  status       text not null default 'pending',   -- 'pending' | 'approved' | 'rejected'
  featured     boolean not null default false,    -- shown first on the Home page
  approved_by_name text,
  approved_at  timestamptz,
  created_at   timestamptz default now()
);

-- Visitors have no account, so student_id must be allowed to be empty,
-- and we keep a contact so the office can check who wrote it.
alter table public.reviews alter column student_id drop not null;
alter table public.reviews add column if not exists contact text;

-- One rating per student per course (and one overall institute rating each).
-- Visitor rows have student_id = null, which Postgres treats as always distinct,
-- so this never blocks a visitor from reviewing.
create unique index if not exists reviews_one_per_student
  on public.reviews (student_id, coalesce(course_slug, '__institute__'));

create index if not exists reviews_public_idx
  on public.reviews (status, course_slug);

alter table public.reviews enable row level security;

-- Website visitors see only APPROVED reviews.
drop policy if exists "anyone reads approved reviews" on public.reviews;
create policy "anyone reads approved reviews" on public.reviews
  for select using (status = 'approved');

-- A student always sees their own, whatever the status.
drop policy if exists "student reads own reviews" on public.reviews;
create policy "student reads own reviews" on public.reviews
  for select using (student_id = auth.uid());

-- A logged-in student may add their own rating; it always starts as 'pending'.
drop policy if exists "student adds own review" on public.reviews;
create policy "student adds own review" on public.reviews
  for insert with check (
    student_id = auth.uid() and status = 'pending' and featured = false
  );

-- Anyone visiting the website may submit a review. It is write-only for them:
-- they can never read, edit or publish anything, and it starts as 'pending'.
drop policy if exists "anyone submits a review" on public.reviews;
create policy "anyone submits a review" on public.reviews
  for insert with check (
    student_id is null
    and status = 'pending'
    and featured = false
    and char_length(student_name) between 2 and 60
    and char_length(coalesce(review, '')) <= 500
  );

-- A student may edit their own rating, but editing sends it back for approval.
drop policy if exists "student edits own review" on public.reviews;
create policy "student edits own review" on public.reviews
  for update using (student_id = auth.uid())
  with check (student_id = auth.uid() and status = 'pending' and featured = false);

-- ...and may remove it.
drop policy if exists "student deletes own review" on public.reviews;
create policy "student deletes own review" on public.reviews
  for delete using (student_id = auth.uid());

-- Admin moderates everything.
drop policy if exists "admin manage reviews" on public.reviews;
create policy "admin manage reviews" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());
```

## What you get

**Website visitor** — Home page → **Write a Review**
- Name, an optional phone/email, what they are rating (institute or a course), stars and a review.
- Sees a thank-you message; the review stays hidden until approved.

**Student** — Dashboard → **Ratings** tab
- Same thing, but signed in: their review carries a green **Verified student** tick on the website.
- One rating per course; they can edit or delete it, and an edit goes back for approval.

**Admin** — Dashboard → **Reviews** tab
- Every new rating lands in **Pending** — from students and visitors alike.
- Each one shows whether it came from a **student** (with Login ID) or a **website visitor**
  (with the phone/email they left), so you can check before approving.
- **Approve** / **Reject** / **Unpublish** / **Delete**, and **⭐ Feature** the best ones so they
  show first on the Home page.

**Website**
- Home page: a **Student Ratings** section with the score out of 5, the 5★…1★ breakdown,
  the review count and the best reviews.
- Course cards and course detail pages: that course's own star rating and review count.

> A visitor can submit but can never read other people's pending reviews — exactly like the
> admission enquiry form. Combined with admin approval, nothing reaches the website unchecked.
