import { useCallback, useEffect, useState } from 'react';
import {
  Wallet,
  Loader2,
  CalendarClock,
  QrCode,
  Smartphone,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
  X
} from 'lucide-react';
import { supabase, type Fees, type FeePayment } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';
import { paymentInfo, siteInfo } from '../../../data';
import { PAYMENT_BUCKET, upiPayLink, rupees, methodLabel, feeDate } from '../../../lib/fees';
import { FeeReceipt } from './FeeReceipt';

export function StudentFees() {
  const { profile } = useAuth();
  const [fees, setFees] = useState<Fees | null>(null);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPay, setShowPay] = useState(false);
  const [receipt, setReceipt] = useState<FeePayment | null>(null);

  // Pay form
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');
  const [shot, setShot] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!supabase || !profile) return;
    const [{ data: f }, { data: p }] = await Promise.all([
      supabase.from('fees').select('*').eq('student_id', profile.id).maybeSingle(),
      supabase
        .from('fee_payments')
        .select('*')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false })
    ]);
    setFees((f as Fees) ?? null);
    setPayments((p as FeePayment[]) ?? []);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    load();
  }, [load]);

  const pending = fees ? Number(fees.total_amount) - Number(fees.paid_amount) : 0;

  const openPay = () => {
    setAmount(pending > 0 ? String(pending) : '');
    setReference('');
    setNote('');
    setShot(null);
    setMsg(null);
    setShowPay(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !profile) return;
    const value = Number(amount);
    if (!value || value <= 0) {
      setMsg({ type: 'err', text: 'Please enter the amount you paid.' });
      return;
    }
    // The screenshot is the office's proof of payment, so it is compulsory.
    if (!shot) {
      setMsg({ type: 'err', text: 'Please attach the payment screenshot from your UPI app.' });
      return;
    }
    if (shot.size > 5 * 1024 * 1024) {
      setMsg({ type: 'err', text: 'Screenshot is too large. Please attach an image under 5 MB.' });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const safe = shot.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      // The storage policy requires the student's own id as the first folder.
      const screenshotPath = `${profile.id}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from(PAYMENT_BUCKET).upload(screenshotPath, shot);
      if (upErr) {
        setMsg({
          type: 'err',
          text: `Screenshot could not be uploaded — ${upErr.message}. (Office: check that the private "${PAYMENT_BUCKET}" storage bucket exists — SUPABASE_SETUP_PART6.md Step B.)`
        });
        return;
      }

      const { error } = await supabase.from('fee_payments').insert({
        student_id: profile.id,
        student_name: profile.full_name,
        login_id: profile.login_id,
        amount: value,
        method: 'upi',
        reference_no: reference.trim() || null,
        screenshot_path: screenshotPath,
        note: note.trim() || null,
        status: 'pending',
        paid_on: new Date().toISOString().slice(0, 10)
      });
      if (error) {
        setMsg({
          type: 'err',
          text: `Could not submit — ${error.message}. (Office: run SUPABASE_SETUP_PART6.md Step A once.)`
        });
        return;
      }

      setShowPay(false);
      setMsg(null);
      await load();
    } catch (e) {
      setMsg({
        type: 'err',
        text: `Could not submit — ${e instanceof Error ? e.message : 'unexpected error'}. Please try again or inform the office.`
      });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
        <Loader2 size={18} className="animate-spin" /> Loading…
      </div>
    );
  }

  const amountNum = Number(amount) || 0;
  const payNote = `Fees ${profile?.login_id ?? ''}`.trim();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
          <Wallet size={20} className="text-accent" /> My Fees
        </h3>
        <button onClick={openPay} className="btn-accent px-5 py-2.5 text-xs">
          <QrCode size={15} /> Pay Fees Now
        </button>
      </div>

      {!fees ? (
        <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No fee details have been added yet. You can still pay using the button above, or contact the office.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="border-t-4 border-t-primary bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Fees</p>
              <p className="mt-1 font-heading text-2xl font-extrabold text-primary">₹{fees.total_amount}</p>
            </div>
            <div className="border-t-4 border-t-green-600 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Paid</p>
              <p className="mt-1 font-heading text-2xl font-extrabold text-green-600">₹{fees.paid_amount}</p>
            </div>
            <div className={`border-t-4 bg-white p-5 shadow-sm ${pending > 0 ? 'border-t-red-600' : 'border-t-green-600'}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pending</p>
              <p className={`mt-1 font-heading text-2xl font-extrabold ${pending > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{pending}
              </p>
            </div>
          </div>

          {(fees.next_due_date || fees.note) && (
            <div className="mt-4 flex flex-wrap items-center gap-4 border border-slate-200 bg-white p-4 text-sm shadow-sm">
              {fees.next_due_date && (
                <span className="flex items-center gap-2 font-semibold text-primary">
                  <CalendarClock size={16} className="text-accent" />
                  Next Due: {new Date(fees.next_due_date).toLocaleDateString('en-IN')}
                </span>
              )}
              {fees.note && <span className="text-slate-600">{fees.note}</span>}
            </div>
          )}
        </>
      )}

      {/* ---------------- Payment history ---------------- */}
      <h4 className="mt-10 flex items-center gap-2 font-heading text-base font-bold text-primary">
        <Receipt size={18} className="text-accent" /> My Payments
      </h4>
      {payments.length === 0 ? (
        <p className="mt-3 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No payments yet. Use <strong>Pay Fees Now</strong> to pay by UPI / QR.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 border border-slate-200 bg-white p-4 shadow-sm">
              <div className="min-w-0">
                <p className="font-heading text-base font-bold text-primary">{rupees(p.amount)}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {methodLabel[p.method]} · {feeDate(p.paid_on ?? p.created_at)}
                  {p.reference_no ? ` · Ref: ${p.reference_no}` : ''}
                </p>
                {p.status === 'rejected' && p.reject_reason && (
                  <p className="mt-1 text-xs text-red-600">Reason: {p.reject_reason}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={p.status} />
                {p.status === 'verified' && (
                  <button onClick={() => setReceipt(p)} className="btn-primary px-4 py-2 text-xs">
                    <Receipt size={14} /> Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- Pay dialog ---------------- */}
      {showPay && (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-slate-900/70 p-4">
          <div className="mx-auto max-w-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 bg-primary px-5 py-3.5">
              <h4 className="flex items-center gap-2 font-heading text-base font-bold text-white">
                <QrCode size={18} className="text-accent" /> Pay Fees
              </h4>
              <button onClick={() => setShowPay(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-2">
              {/* Step 1 - amount + QR */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-accent">Step 1 — Pay</p>
                <label className="mt-3 block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Amount (₹) *
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1.5 w-full border border-slate-300 px-3 py-2 font-heading text-lg font-bold text-primary focus:border-primary focus:outline-none"
                  />
                </label>

                <div className="mt-4 border border-slate-200 p-3 text-center">
                  <img
                    src={paymentInfo.qrImage}
                    alt={`UPI QR code of ${paymentInfo.merchantName}`}
                    className="mx-auto w-full max-w-[240px]"
                  />
                  <p className="mt-2 break-all text-[11px] text-slate-500">
                    UPI ID: {paymentInfo.upiId}
                  </p>
                </div>

                <a
                  href={upiPayLink(amountNum, payNote)}
                  className={`btn-accent mt-3 w-full text-xs sm:hidden ${amountNum <= 0 ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <Smartphone size={15} /> Pay with UPI App
                </a>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  Scan the QR in GPay / PhonePe / Paytm / BHIM and pay the amount above. On a phone you
                  can simply tap <strong>Pay with UPI App</strong>.
                </p>
              </div>

              {/* Step 2 - submit proof */}
              <form onSubmit={submit}>
                <p className="text-xs font-bold uppercase tracking-wide text-accent">
                  Step 2 — Tell us about it
                </p>
                <label className="mt-3 block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    UTR / Reference No. *
                  </span>
                  <input
                    required
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="12 digit number from your UPI app"
                    className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="mt-3 block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Payment screenshot *
                  </span>
                  <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={(e) => setShot(e.target.files?.[0] ?? null)}
                    className="mt-1.5 w-full text-sm text-slate-600 file:mr-3 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white"
                  />
                  <span className="mt-1 block text-xs text-slate-400">
                    The success screen from GPay / PhonePe / Paytm. Without it the office cannot verify
                    your payment.
                  </span>
                </label>

                <label className="mt-3 block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Note (optional)
                  </span>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. 2nd instalment, PGDCA"
                    className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </label>

                <div className="mt-4 border-l-4 border-l-accent bg-bg-alt p-3 text-[11px] leading-relaxed text-slate-600">
                  The office will check this against the bank statement and approve it. Your receipt
                  becomes available as soon as it is verified — usually the same working day.
                </div>

                {msg && (
                  <p
                    className={`mt-3 border-l-4 px-3 py-2 text-sm ${
                      msg.type === 'ok'
                        ? 'border-l-green-600 bg-green-50 text-green-700'
                        : 'border-l-red-600 bg-red-50 text-red-700'
                    }`}
                  >
                    {msg.text}
                  </p>
                )}

                <button type="submit" disabled={busy} className="btn-primary mt-4 w-full text-xs disabled:opacity-60">
                  {busy ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  {busy ? 'Submitting…' : 'Submit Payment Details'}
                </button>
                <p className="mt-2 text-center text-[11px] text-slate-400">
                  Trouble paying? Call {siteInfo.contact.phone}
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {receipt && <FeeReceipt payment={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}

export function StatusBadge({ status }: { status: FeePayment['status'] }) {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 bg-green-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
        <CheckCircle2 size={11} /> Verified
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 bg-red-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
        <XCircle size={11} /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
      <Clock size={11} /> Pending verification
    </span>
  );
}
