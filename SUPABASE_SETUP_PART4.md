# Supabase Setup — Part 4 (Website Admission Enquiries)

This makes every admission enquiry from the website (Contact page + Admissions page)
save reliably into Supabase and show up in the **Admin dashboard → Enquiries** tab.

Run this once in Supabase → **SQL Editor** → paste → **Run**.

```sql
-- WEBSITE ENQUIRIES ----------------------------------------------
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text,
  email text,
  course text,
  message text,
  created_at timestamptz default now()
);
alter table public.enquiries enable row level security;

-- Anyone (a website visitor, not logged in) can SUBMIT an enquiry...
create policy "anyone submit enquiry" on public.enquiries for insert with check (true);

-- ...but only an admin can READ or DELETE them.
create policy "admin read enquiries" on public.enquiries for select using (public.is_admin());
create policy "admin delete enquiries" on public.enquiries for delete using (public.is_admin());
```

## What you get
- **Admin dashboard → Enquiries tab (now the first tab):** every enquiry submitted from the
  website appears here — name, mobile (click to call), email (click to mail), course, message and date.
- Nothing is ever lost: enquiries are stored in your own database, no email activation needed.
- The form **also** tries to email the support inbox (best effort), but the dashboard is the reliable copy.

> Visitor enquiries are write-only for the public: a visitor can submit but can never read
> anyone's enquiries. Only a logged-in admin can see them.
