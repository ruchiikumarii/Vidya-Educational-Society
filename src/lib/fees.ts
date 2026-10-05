import { supabase, type FeePayment } from './supabase';
import { paymentInfo } from '../data';

/** Private bucket that holds payment screenshots (see SUPABASE_SETUP_PART6.md). */
export const PAYMENT_BUCKET = 'payments';

/**
 * UPI deep link. On a phone this opens GPay / PhonePe / Paytm with the institute's
 * account, the amount and the note already filled in. On a desktop nothing happens,
 * which is why the QR image is always shown next to it.
 */
export function upiPayLink(amount: number, note: string) {
  const params = new URLSearchParams({
    pa: paymentInfo.upiId,
    pn: paymentInfo.merchantName,
    am: amount.toFixed(2),
    cu: 'INR',
    tn: note
  });
  return `upi://pay?${params.toString()}`;
}

/** 12500 -> "₹12,500" */
export function rupees(n: number) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
  'Eighteen', 'Nineteen'
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const t = TENS[Math.floor(n / 10)];
  const o = ONES[n % 10];
  return o ? `${t} ${o}` : t;
}

/** Indian numbering: 125430 -> "One Lakh Twenty Five Thousand Four Hundred Thirty" */
function indianWords(num: number): string {
  if (num === 0) return 'Zero';
  const parts: string[] = [];
  const crore = Math.floor(num / 10000000);
  if (crore) {
    parts.push(`${indianWords(crore)} Crore`);
    num %= 10000000;
  }
  const lakh = Math.floor(num / 100000);
  if (lakh) {
    parts.push(`${twoDigits(lakh)} Lakh`);
    num %= 100000;
  }
  const thousand = Math.floor(num / 1000);
  if (thousand) {
    parts.push(`${twoDigits(thousand)} Thousand`);
    num %= 1000;
  }
  const hundred = Math.floor(num / 100);
  if (hundred) {
    parts.push(`${ONES[hundred]} Hundred`);
    num %= 100;
  }
  if (num) parts.push(twoDigits(num));
  return parts.join(' ');
}

/** Amount in words for the receipt, e.g. "Rupees Four Thousand Five Hundred Only". */
export function amountInWords(amount: number): string {
  const rounded = Math.round(Number(amount) * 100) / 100;
  const whole = Math.floor(rounded);
  const paise = Math.round((rounded - whole) * 100);
  let text = `Rupees ${indianWords(whole)}`;
  if (paise > 0) text += ` and ${twoDigits(paise)} Paise`;
  return `${text} Only`;
}

export const methodLabel: Record<FeePayment['method'], string> = {
  upi: 'UPI / QR',
  cash: 'Cash',
  bank: 'Bank Transfer'
};

/** "5 Oct 2026" */
export function feeDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Payment screenshots live in a private bucket, so viewing one needs a short-lived
 * signed URL. Returns null when the file is missing or the link cannot be created.
 */
export async function screenshotUrl(path: string) {
  if (!supabase) return null;
  const { data } = await supabase.storage.from(PAYMENT_BUCKET).createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}
