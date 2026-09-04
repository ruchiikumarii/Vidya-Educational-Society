# Supabase Setup — Part 5 (Website Notices / Announcements)

This lets the admin post an **announcement that also shows on the public website**
(Home page notice board + the `/announcements` page), with an optional
**image, PDF or any file** attached, plus an optional external link.

Portal announcements keep working exactly as before — a notice only becomes public
when the admin ticks **“Also show on the website”**.

Run this once in Supabase → **SQL Editor** → paste → **Run**.

```sql
-- WEBSITE NOTICES -------------------------------------------------
-- Extra columns on the existing announcements table.
alter table public.announcements add column if not exists is_public  boolean not null default false;
alter table public.announcements add column if not exists pinned     boolean not null default false;
alter table public.announcements add column if not exists file_url   text;
alter table public.announcements add column if not exists file_name  text;
alter table public.announcements add column if not exists file_type  text;   -- 'image' | 'file'
alter table public.announcements add column if not exists link_url   text;
alter table public.announcements add column if not exists expires_at date;   -- auto-hides after this date

-- Website visitors (not logged in) can read ONLY the public notices.
-- RLS policies are OR-ed, so the existing "read announcements" policy for
-- logged-in users keeps working untouched.
drop policy if exists "anyone read public announcements" on public.announcements;
create policy "anyone read public announcements" on public.announcements
  for select using (is_public = true);

-- Only an admin may create or change a PUBLIC notice.
drop policy if exists "admin update announcements" on public.announcements;
create policy "admin update announcements" on public.announcements
  for update using (public.is_admin()) with check (public.is_admin());
```

## Storage (for the attached image / PDF)

Attachments reuse the existing **public `gallery` bucket** (created in Part 2) under an
`announcements/` folder — **nothing new to create**.

If your `gallery` bucket restricts file types, open **Storage → gallery → Settings** and make
sure **Allowed MIME types** is empty (all types) so PDFs can be uploaded too.

## What you get
- **Admin dashboard → Announcements tab**
  - “Also show on the website” checkbox → the notice appears on the public site.
  - **Attachment**: image, PDF or any document (shown/downloadable on the website).
  - **Link**: an optional external URL (form link, result link, etc.).
  - **Pin to top**: keeps an important notice first.
  - **Hide after**: a date on which the notice automatically disappears from the website.
- **Home page** — a “Latest Notices” board right under the banner (top 3, auto-hides when empty).
- **`/announcements` page** — the full notice board, linked from the main menu as **Notices**.

> Teachers can still post portal announcements, but only an **admin** can publish to the website.
