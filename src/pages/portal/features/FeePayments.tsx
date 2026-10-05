import { useEffect, useState } from 'react';
import {
  IndianRupee,
  Loader2,
  Receipt,
  CheckCircle2,
  XCircle,
  ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  X
} from 'lucide-react';
import { supabase, type FeePayment, type Profile, type PaymentMethod } from '../../../lib/supabase';
import { rupees, methodLabel, feeDate, screenshotUrl } from '../../../lib/fees';
import { FeeReceipt } from './FeeReceipt';
import { StatusBadge } from './StudentFees';
import { PortalTabs } from './PortalTabs';

export function FeePayments() {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Pending');
  const [receipt, setReceipt] = useState<FeePayment | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [proof, setProof] = useState<{ payment: FeePayment; url: string } | null>(null);
  const [proofLoading, setProofLoading] = useState<string | null>(null);

  // Record-offline-payment form
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');
  const [paidOn, setPaidOn] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!supabase) return;
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from('fee_payments').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('role', 'student').order('login_id')
    ]);
    setPayments((p as FeePayment[]) ?? []);
    setStudents((s as Profile[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const verify = async (p: FeePayment) => {
    if (!supabase) return;
    if (!confirm(`Verify ${rupees(p.amount)} from ${p.student_name}?\n\nThis issues a receipt and adds the amount to their paid total.`)) return;
    setWorkingId(p.id);
    setErr('');
    const { error } = await supabase.rpc('verify_fee_payment', { p_id: p.id, p_paid_on: p.paid_on });
    setWorkingId(null);
    if (error) {
      setErr('Could not verify. Make sure SUPABASE_SETUP_PART6.md has been run.');
      return;
    }
    await load();
  };

  const reject = async (p: FeePayment) => {
    if (!supabase) return;
    const verified = p.status === 'verified';
    const reason = window.prompt(
      verified
        ? `Undo this VERIFIED payment of ${rupees(p.amount)}?\nThe amount will be removed from the paid total and the receipt cancelled.\n\nReason:`
        : `Reject ${rupees(p.amount)} from ${p.student_name}?\n\nReason (the student will see this):`,
      verified ? 'Verified by mistake' : 'Payment not found in bank statement'
    );
    if (reason === null) return;
    setWorkingId(p.id);
    setErr('');
    const { error } = await supabase.rpc('reject_fee_payment', { p_id: p.id, p_reason: reason || null });
    setWorkingId(null);
    if (error) {
      setErr('Could not update. Make sure SUPABASE_SETUP_PART6.md has been run.');
      return;
    }
    await load();
  };

  const showProof = async (p: FeePayment) => {
    if (!p.screenshot_path) return;
    setProofLoading(p.id);
    const url = await screenshotUrl(p.screenshot_path);
    setProofLoading(null);
    if (url) setProof({ payment: p, url });
    else setErr('Could not open the screenshot. It may have been removed from storage.');
  };

  const remove = async (p: FeePayment) => {
    if (!supabase) return;
    if (p.status === 'verified') {
      alert('Undo (Reject) this payment first — deleting a verified payment would leave the paid total wrong.');
      return;
    }
    if (!confirm('Delete this payment entry permanently?')) return;
    await supabase.from('fee_payments').delete().eq('id', p.id);
    await load();
  };

  const addOffline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const student = students.find((s) => s.id === studentId);
    const value = Number(amount);
    if (!student || !value) return;
    setBusy(true);
    setErr('');
    try {
      const { data, error } = await supabase
        .from('fee_payments')
        .insert({
          student_id: student.id,
          student_name: student.full_name,
          login_id: student.login_id,
          amount: value,
          method,
          reference_no: reference.trim() || null,
          note: note.trim() || null,
          status: 'pending',
          paid_on: paidOn
        })
        .select()
        .single();
      if (error) throw error;
      // A payment taken at the counter is confirmed by the admin on the spot.
      const { error: vErr } = await supabase.rpc('verify_fee_payment', {
        p_id: (data as FeePayment).id,
        p_paid_on: paidOn
      });
      if (vErr) throw vErr;
      setStudentId('');
      setAmount('');
      setReference('');
      setNote('');
      setTab('Verified');
      await load();
    } catch {
      setErr('Could not record. Make sure SUPABASE_SETUP_PART6.md has been run.');
    } finally {
      setBusy(false);
    }
  };

  const pendingList = payments.filter((p) => p.status === 'pending');
  const verifiedList = payments.filter((p) => p.status === 'verified');
  const rejectedList = payments.filter((p) => p.status === 'rejected');
  const list = tab === 'Pending' ? pendingList : tab === 'Verified' ? verifiedList : rejectedList;

  const inputClass =
    'mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none';
  const labelClass = 'text-xs font-semibold uppercase tracking-wide text-slate-600';

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      {/* ---------------- Record an offline payment ---------------- */}
      <div>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <Plus size={18} className="text-accent" /> Record Offline Payment
        </h3>
        <form onSubmit={addOffline} className="mt-4 space-y-4 border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block">
            <span className={labelClass}>Student *</span>
            <select required value={studentId} onChange={(e) => setStudentId(e.target.value)}
              className={`${inputClass} bg-white`}>
              <option value="">Select student…</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.login_id})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Amount (₹) *</span>
            <input required type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)}
              className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Mode</span>
            <select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className={`${inputClass} bg-white`}>
              <option value="cash">Cash</option>
              <option value="bank">Bank Transfer</option>
              <option value="upi">UPI / QR</option>
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Reference No. (optional)</span>
            <input value={reference} onChange={(e) => setReference(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Paid on</span>
            <input type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Description (optional)</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. 1st instalment, PGDCA"
              className={inputClass} />
          </label>
          <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Receipt size={16} />}
            {busy ? 'Saving…' : 'Record & Issue Receipt'}
          </button>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Use this for cash or bank payments taken at the counter — it is verified straight away and
            the receipt is issued immediately.
          </p>
        </form>
      </div>

      {/* ---------------- Payment queue ---------------- */}
      <div>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <IndianRupee size={18} className="text-accent" /> Fee Payments
          {pendingList.length > 0 && (
            <span className="bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              {pendingList.length} pending
            </span>
          )}
        </h3>

        {err && (
          <p className="mt-3 border-l-4 border-l-red-600 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>
        )}

        {/* Running totals so the office can see collections at a glance */}
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="Awaiting verification"
            value={rupees(pendingList.reduce((t, p) => t + Number(p.amount), 0))}
            sub={`${pendingList.length} payment${pendingList.length === 1 ? '' : 's'}`}
            tone="amber"
          />
          <SummaryCard
            label="Verified / collected"
            value={rupees(verifiedList.reduce((t, p) => t + Number(p.amount), 0))}
            sub={`${verifiedList.length} receipt${verifiedList.length === 1 ? '' : 's'} issued`}
            tone="green"
          />
          <SummaryCard
            label="Rejected"
            value={rupees(rejectedList.reduce((t, p) => t + Number(p.amount), 0))}
            sub={`${rejectedList.length} payment${rejectedList.length === 1 ? '' : 's'}`}
            tone="slate"
          />
        </div>

        <div className="mt-4">
          <PortalTabs
            tabs={[
              { key: 'Pending', label: `Pending (${pendingList.length})` },
              { key: 'Verified', label: `Verified (${verifiedList.length})` },
              { key: 'Rejected', label: `Rejected (${rejectedList.length})` }
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {loading ? (
          <div className="flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : list.length === 0 ? (
          <p className="bg-white p-6 text-sm text-slate-500 shadow-sm">
            {tab === 'Pending' ? 'No payments waiting for verification.' : `No ${tab.toLowerCase()} payments.`}
          </p>
        ) : (
          <div className="space-y-3">
            {list.map((p) => (
              <div key={p.id} className="border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold text-primary">
                      {p.student_name}{' '}
                      <span className="font-normal text-slate-500">({p.login_id})</span>
                    </p>
                    <p className="mt-0.5 font-heading text-xl font-extrabold text-primary">
                      {rupees(p.amount)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {methodLabel[p.method]} · paid {feeDate(p.paid_on ?? p.created_at)} · submitted{' '}
                      {feeDate(p.created_at)}
                    </p>
                    {p.reference_no && (
                      <p className="mt-1 text-xs text-slate-600">
                        <span className="font-semibold">UTR / Ref:</span> {p.reference_no}
                      </p>
                    )}
                    {p.note && <p className="mt-1 text-xs text-slate-600">{p.note}</p>}
                    {p.receipt_no && (
                      <p className="mt-1 text-xs font-semibold text-green-700">Receipt {p.receipt_no}</p>
                    )}
                    {p.status === 'rejected' && p.reject_reason && (
                      <p className="mt-1 text-xs text-red-600">Reason: {p.reject_reason}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={p.status} />
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {p.screenshot_path && (
                        <button
                          onClick={() => showProof(p)}
                          disabled={proofLoading === p.id}
                          className="inline-flex items-center gap-1.5 border border-slate-300 px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary disabled:opacity-60"
                        >
                          {proofLoading === p.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <ImageIcon size={13} />
                          )}
                          Screenshot
                        </button>
                      )}
                      {p.status === 'pending' && (
                        <button
                          onClick={() => verify(p)}
                          disabled={workingId === p.id}
                          className="inline-flex items-center gap-1.5 bg-green-600 px-3 py-1.5 text-xs font-semibold uppercase text-white hover:bg-green-700 disabled:opacity-60"
                        >
                          {workingId === p.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          Verify
                        </button>
                      )}
                      {p.status === 'verified' && (
                        <button onClick={() => setReceipt(p)} className="btn-primary px-3 py-1.5 text-xs">
                          <Receipt size={13} /> Receipt
                        </button>
                      )}
                      {p.status !== 'rejected' && (
                        <button
                          onClick={() => reject(p)}
                          disabled={workingId === p.id}
                          className="inline-flex items-center gap-1.5 border border-red-300 px-3 py-1.5 text-xs font-semibold uppercase text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          <XCircle size={13} /> {p.status === 'verified' ? 'Undo' : 'Reject'}
                        </button>
                      )}
                      <button onClick={() => remove(p)} className="text-slate-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {proof && (
        <ScreenshotModal
          payment={proof.payment}
          url={proof.url}
          onClose={() => setProof(null)}
        />
      )}

      {receipt && <FeeReceipt payment={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  tone
}: {
  label: string;
  value: string;
  sub: string;
  tone: 'amber' | 'green' | 'slate';
}) {
  const border =
    tone === 'amber' ? 'border-t-amber-500' : tone === 'green' ? 'border-t-green-600' : 'border-t-slate-400';
  const text = tone === 'amber' ? 'text-amber-600' : tone === 'green' ? 'text-green-600' : 'text-slate-500';
  return (
    <div className={`border-t-4 bg-white p-4 shadow-sm ${border}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 font-heading text-xl font-extrabold ${text}`}>{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  );
}

/** Payment proof shown in a popup over the dashboard - no new browser tab. */
function ScreenshotModal({
  payment,
  url,
  onClose
}: {
  payment: FeePayment;
  url: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/80 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-2xl flex-col bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 bg-primary px-5 py-3">
          <div className="min-w-0">
            <h4 className="font-heading text-sm font-bold text-white">
              {payment.student_name} · {rupees(payment.amount)}
            </h4>
            <p className="text-xs text-white/70">
              {payment.reference_no ? `UTR: ${payment.reference_no} · ` : ''}
              {feeDate(payment.paid_on ?? payment.created_at)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full size in a new tab"
              className="text-white/80 hover:text-white"
            >
              <ExternalLink size={17} />
            </a>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="overflow-auto bg-slate-100 p-3">
          <img src={url} alt="Payment screenshot" className="mx-auto max-h-[70vh] w-auto" />
        </div>
      </div>
    </div>
  );
}
