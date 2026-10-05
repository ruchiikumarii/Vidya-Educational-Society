import { Printer, X } from 'lucide-react';
import { type FeePayment } from '../../../lib/supabase';
import { amountInWords, methodLabel } from '../../../lib/fees';

/**
 * Header text printed on the institute's official Money Receipt book.
 * Kept here in one place so the office can correct it without touching the layout.
 */
const RECEIPT_HEADER = {
  name: 'VIDYA EDUCATIONAL SOCIETY',
  address: 'COLLEGE ROAD, KEONJHAR (ODISHA)',
  line3: '(EDUCATION & TRAINING)',
  regnNo: 'Regn. No. : IGR 23108/15/09-10',
  cell: 'Cell : 9437193547',
  website: 'website : vidyaeducationalsociety.com',
  estd: 'ESTD - 1997',
  brand: 'NEURON',
  rightLines: [
    'FRANCHISEE-ITCT COMPUTER EDUCATION NAGPUR',
    'STUDY CENTRE : NORTH ORISSA UNIVERSITY',
    'M.S. UNIVERSITY, KSOU',
    'ASSOCIATE-MSME-DI, GOVT. OF INDIA'
  ]
};

const RULES = [
  'Fee collected inclusive of Service Tax paid to Govt. of India.',
  'Payment is valid subject to realisation of cheques.',
  'The payment once collected is not refundable/transferable under any circumstances.',
  'The payment collected is valid for the specific licence office only.'
];

function printDate(value: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * The official Money Receipt, shown in a full-screen overlay with a Print button.
 * Printing uses the `.receipt-print` rules in index.css, so only the receipt itself
 * goes on the page - the browser's "Save as PDF" gives the student a PDF copy.
 */
export function FeeReceipt({ payment, onClose }: { payment: FeePayment; onClose: () => void }) {
  const amount = Number(payment.amount);
  const whole = Math.floor(amount);
  const paise = Math.round((amount - whole) * 100);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/70 p-4 print:static print:bg-transparent print:p-0">
      {/* Toolbar - never printed */}
      <div className="no-print mx-auto mb-4 flex max-w-4xl items-center justify-between gap-3">
        <h2 className="font-heading text-base font-bold text-white">
          Money Receipt {payment.receipt_no}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-accent px-5 py-2.5 text-xs">
            <Printer size={15} /> Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 border border-white/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-white/10"
          >
            <X size={15} /> Close
          </button>
        </div>
      </div>

      <div className="receipt-print mx-auto max-w-4xl bg-white p-3">
        <div className="border-[3px] border-[#1f6fb2] p-1">
          <div className="border border-[#1f6fb2] px-5 py-4 text-[#1f6fb2]">
            {/* ---------- Header ---------- */}
            <div className="flex items-start gap-4">
              <img
                src="/logo.png"
                alt=""
                className="mt-1 h-20 w-20 shrink-0 object-contain"
              />

              <div className="flex-1 text-center leading-tight">
                <h1 className="font-heading text-xl font-bold tracking-[0.18em] sm:text-2xl">
                  {RECEIPT_HEADER.name}
                </h1>
                <p className="mt-1 text-[11px] font-semibold tracking-[0.12em]">{RECEIPT_HEADER.address}</p>
                <p className="text-[11px] font-semibold tracking-[0.12em]">{RECEIPT_HEADER.line3}</p>
                <p className="text-[11px] font-semibold tracking-[0.08em]">{RECEIPT_HEADER.regnNo}</p>
                <p className="text-[11px] font-semibold tracking-[0.08em]">{RECEIPT_HEADER.cell}</p>
                <p className="text-[11px] font-semibold tracking-[0.08em]">{RECEIPT_HEADER.website}</p>
              </div>

              <div className="w-56 shrink-0 border-l border-[#1f6fb2] pl-4 text-center leading-tight">
                <p className="text-[10px] font-semibold tracking-[0.2em]">{RECEIPT_HEADER.estd}</p>
                <p className="font-heading text-2xl font-bold tracking-[0.25em]">{RECEIPT_HEADER.brand}</p>
                {RECEIPT_HEADER.rightLines.map((l) => (
                  <p key={l} className="text-[8px] font-semibold tracking-[0.06em]">
                    {l}
                  </p>
                ))}
              </div>
            </div>

            <p className="mt-3 text-center">
              <span className="border-b border-[#1f6fb2] font-heading text-sm font-bold tracking-[0.3em]">
                MONEY RECEIPT
              </span>
            </p>

            {/* ---------- Student / receipt details ---------- */}
            <div className="mt-4 grid gap-x-8 gap-y-2 text-[12px] sm:grid-cols-[1fr_280px]">
              <Field label="Name" value={payment.student_name} />
              <Field label="No." value={payment.receipt_no ?? '—'} />
              <Field label="Course" value={payment.course || payment.login_id || '—'} />
              <Field label="Date" value={printDate(payment.paid_on ?? payment.created_at)} />
            </div>

            {/* ---------- Description table ---------- */}
            <table className="mt-4 w-full table-fixed border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#1f6fb2] text-white">
                  <th className="border border-[#1f6fb2] py-1.5 text-center font-heading text-[12px] font-bold tracking-[0.25em]">
                    DESCRIPTION
                  </th>
                  <th className="w-24 border border-[#1f6fb2] py-1.5 text-center font-heading font-bold tracking-widest">
                    Rs.
                  </th>
                  <th className="w-16 border border-[#1f6fb2] py-1.5 text-center font-heading font-bold tracking-widest">
                    P.
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#1f6fb2] px-3 py-1.5">
                    Course / Tuition fee received by {methodLabel[payment.method]}
                    {payment.reference_no ? ` · Ref: ${payment.reference_no}` : ''}
                  </td>
                  <td className="border border-[#1f6fb2] px-3 py-1.5 text-right">
                    {whole.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-[#1f6fb2] px-3 py-1.5 text-right">
                    {String(paise).padStart(2, '0')}
                  </td>
                </tr>
                {payment.note && (
                  <tr>
                    <td className="border border-[#1f6fb2] px-3 py-1.5">{payment.note}</td>
                    <td className="border border-[#1f6fb2] px-3 py-1.5" />
                    <td className="border border-[#1f6fb2] px-3 py-1.5" />
                  </tr>
                )}
                {/* Blank rows keep the printed receipt the same height as the book */}
                {Array.from({ length: payment.note ? 1 : 2 }).map((_, i) => (
                  <tr key={i}>
                    <td className="border border-[#1f6fb2] px-3 py-1.5">&nbsp;</td>
                    <td className="border border-[#1f6fb2] px-3 py-1.5" />
                    <td className="border border-[#1f6fb2] px-3 py-1.5" />
                  </tr>
                ))}
                <tr>
                  <td className="px-3 py-1.5 text-right font-heading font-bold tracking-[0.2em]">TOTAL</td>
                  <td className="border border-[#1f6fb2] px-3 py-1.5 text-right font-bold">
                    {whole.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-[#1f6fb2] px-3 py-1.5 text-right font-bold">
                    {String(paise).padStart(2, '0')}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mt-3 text-[12px]">
              <span className="font-semibold tracking-[0.12em]">In words</span>{' '}
              <span className="border-b border-dotted border-[#1f6fb2]">{amountInWords(amount)}</span>
            </p>

            {/* ---------- Rules + signature ---------- */}
            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_240px]">
              <div>
                <p className="text-[12px] font-bold tracking-[0.08em]">Rules &amp; Regulations:</p>
                <ul className="mt-1 space-y-0.5 text-[9px] leading-snug">
                  {RULES.map((r) => (
                    <li key={r}>▪ {r}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center justify-end pb-1 text-center">
                <p className="text-[11px]">For</p>
                <p className="mt-6 font-heading text-[11px] font-bold tracking-[0.12em]">
                  {RECEIPT_HEADER.name}
                </p>
              </div>
            </div>

            <p className="mt-2 text-center text-[8px] tracking-wide text-slate-500">
              Computer generated receipt
              {payment.verified_by_name ? ` · verified by ${payment.verified_by_name}` : ''}
              {payment.verified_at
                ? ` on ${new Date(payment.verified_at).toLocaleDateString('en-IN')}`
                : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-end gap-2">
      <span className="shrink-0 font-semibold tracking-[0.12em]">{label} :</span>
      <span className="min-w-0 flex-1 border-b border-[#1f6fb2] pb-0.5 font-semibold break-words">
        {value}
      </span>
    </p>
  );
}
