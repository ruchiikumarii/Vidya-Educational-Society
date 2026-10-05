# Supabase Setup — Part 6 (Online Fee Payment + Money Receipt)

This lets a **logged-in student pay fees by scanning the institute's SBI UPI QR**, submit the
UPI reference (UTR) number, and — **after the admin verifies it** — download/print an official
**Money Receipt** in the institute's own receipt format.

> **Important:** a UPI QR payment goes straight to the bank account; the website never
> finds out on its own whether the money actually arrived. So the receipt is issued only
> after an admin checks the bank/SBI statement and clicks **Verify**. Until then the student
> sees *"Payment submitted — verification pending"*. This stops anyone from typing a fake
> UTR number and walking away with a valid-looking receipt.

---

## STEP A — Tables, receipt numbering and the verify/reject functions

Run this once in Supabase → **SQL Editor** → paste → **Run**.

```sql
-- FEE PAYMENTS ----------------------------------------------------
create table if not exists public.fee_payments (
  id uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.profiles(id) on delete cascade,
  student_name text not null,
  login_id     text,
  course       text,
  amount       numeric not null check (amount > 0),
  method       text not null default 'upi',       -- 'upi' | 'cash' | 'bank'
  reference_no text,                              -- UPI UTR / transaction id
  screenshot_path text,                           -- payment screenshot in the 'payments' bucket
  note         text,
  status       text not null default 'pending',   -- 'pending' | 'verified' | 'rejected'
  receipt_no   text unique,                       -- issued only when verified
  paid_on      date,
  verified_by  uuid references public.profiles(id) on delete set null,
  verified_by_name text,
  verified_at  timestamptz,
  reject_reason text,
  created_at   timestamptz default now()
);
create index if not exists fee_payments_student_idx on public.fee_payments (student_id, created_at desc);
create index if not exists fee_payments_status_idx  on public.fee_payments (status, created_at desc);

alter table public.fee_payments enable row level security;

-- A student may see ONLY their own payments and may only ever submit a 'pending' one.
drop policy if exists "student reads own payments"  on public.fee_payments;
create policy "student reads own payments" on public.fee_payments
  for select using (student_id = auth.uid());

drop policy if exists "student submits own payment" on public.fee_payments;
create policy "student submits own payment" on public.fee_payments
  for insert with check (
    student_id = auth.uid() and status = 'pending' and receipt_no is null
  );

-- Admins can do everything (verify, reject, record cash payments, delete).
drop policy if exists "admin manage payments" on public.fee_payments;
create policy "admin manage payments" on public.fee_payments
  for all using (public.is_admin()) with check (public.is_admin());

-- RECEIPT NUMBERS -------------------------------------------------
-- One running series, so two admins verifying at the same time can never
-- end up with the same receipt number.
create sequence if not exists public.receipt_no_seq start 1;

-- VERIFY ----------------------------------------------------------
-- Issues the receipt number AND adds the amount to the student's paid total,
-- both in one transaction. Running it twice on the same payment is harmless.
create or replace function public.verify_fee_payment(p_id uuid, p_paid_on date default null)
returns public.fee_payments
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.fee_payments;
  rno text;
begin
  if not public.is_admin() then
    raise exception 'Only an admin can verify a payment';
  end if;

  select * into rec from public.fee_payments where id = p_id for update;
  if not found then
    raise exception 'Payment not found';
  end if;
  if rec.status = 'verified' then
    return rec;                      -- already done, never count it twice
  end if;

  rno := 'VES/' || to_char(now(), 'YYYY') || '/' ||
         lpad(nextval('public.receipt_no_seq')::text, 4, '0');

  update public.fee_payments
     set status           = 'verified',
         receipt_no       = rno,
         paid_on          = coalesce(p_paid_on, rec.paid_on, current_date),
         verified_at      = now(),
         verified_by      = auth.uid(),
         verified_by_name = (select full_name from public.profiles where id = auth.uid()),
         reject_reason    = null
   where id = p_id
   returning * into rec;

  insert into public.fees (student_id, total_amount, paid_amount)
  values (rec.student_id, 0, rec.amount)
  on conflict (student_id) do update
    set paid_amount = fees.paid_amount + rec.amount,
        updated_at  = now();

  return rec;
end;
$$;

-- REJECT / UNDO ---------------------------------------------------
-- Rejects a pending payment, or undoes one that was verified by mistake
-- (the amount is taken back off the student's paid total and the receipt is cancelled).
create or replace function public.reject_fee_payment(p_id uuid, p_reason text default null)
returns public.fee_payments
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.fee_payments;
begin
  if not public.is_admin() then
    raise exception 'Only an admin can reject a payment';
  end if;

  select * into rec from public.fee_payments where id = p_id for update;
  if not found then
    raise exception 'Payment not found';
  end if;
  if rec.status = 'rejected' then
    return rec;
  end if;

  if rec.status = 'verified' then
    update public.fees
       set paid_amount = greatest(paid_amount - rec.amount, 0),
           updated_at  = now()
     where student_id = rec.student_id;
  end if;

  update public.fee_payments
     set status           = 'rejected',
         receipt_no       = null,    -- a cancelled receipt number is never reused
         reject_reason    = p_reason,
         verified_at      = now(),
         verified_by      = auth.uid(),
         verified_by_name = (select full_name from public.profiles where id = auth.uid())
   where id = p_id
   returning * into rec;

  return rec;
end;
$$;

grant execute on function public.verify_fee_payment(uuid, date) to authenticated;
grant execute on function public.reject_fee_payment(uuid, text) to authenticated;
```

---

## STEP B — Create the private `payments` storage bucket (payment screenshots)

1. Supabase → **Storage** → **New bucket**
   - **Name:** `payments`
   - **Public bucket: OFF** ❌ (a payment screenshot is private — only the student and the admin see it)
2. Then **SQL Editor** → **New query** → paste → **Run**:

```sql
-- Each student uploads into a folder named after their own user id.
drop policy if exists "student uploads own payment proof" on storage.objects;
create policy "student uploads own payment proof" on storage.objects for insert
  with check (bucket_id = 'payments' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "read own payment proof" on storage.objects;
create policy "read own payment proof" on storage.objects for select
  using (
    bucket_id = 'payments'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

drop policy if exists "admin deletes payment proof" on storage.objects;
create policy "admin deletes payment proof" on storage.objects for delete
  using (bucket_id = 'payments' and public.is_admin());
```

---

## How it works day to day

**Student** — Dashboard → **Fees** tab
1. Sees Total / Paid / Pending.
2. Clicks **Pay Fees Now** → the SBI QR appears with the amount filled in.
   On a phone the **Pay with UPI App** button opens GPay / PhonePe / Paytm with the
   amount and institute name already filled.
3. After paying, enters the **UTR / Reference number** (and optionally a screenshot) → **Submit**.
4. Status shows **Pending verification**.

**Admin** — Dashboard → **Payments** tab
1. New submissions appear under **Pending**, with the UTR and screenshot.
2. Check the amount in your SBI statement → click **Verify** (or **Reject** with a reason).
3. On Verify: a receipt number is issued (`VES/2026/0001`), the amount is added to the
   student's Paid total automatically, and the **Money Receipt** becomes available.
4. **Record offline payment** on the same tab logs a cash / bank-transfer payment taken at the
   counter — it is verified and gets its receipt straight away.

**Receipt** — both student and admin can open **View Receipt** → **Print / Save as PDF**.
It is printed in the institute's own Money Receipt format (logo, header, description table,
amount in words, rules & regulations).

> If a payment was verified by mistake, **Reject** it — the amount is removed from the
> student's paid total and the receipt is cancelled.
