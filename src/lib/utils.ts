import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"
import { siteInfo } from "../data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Submit an admission enquiry.
 * 1) Saves it to Supabase (`enquiries` table) so it always appears in the
 *    Admin dashboard — this is the reliable delivery path.
 * 2) Also tries to email it to the support inbox via FormSubmit (best effort).
 * Returns true if the enquiry was captured (saved or emailed).
 */
export async function sendEnquiry(
  subject: string,
  fields: Record<string, string>
): Promise<boolean> {
  let saved = false

  if (supabase) {
    const { error } = await supabase.from("enquiries").insert({
      name: fields.Name || "",
      mobile: fields.Mobile || "",
      email: fields.Email || "",
      course: fields.Course || "",
      message: fields.Message || "",
    })
    saved = !error
  }

  // Best-effort email notification (works once FormSubmit is activated).
  try {
    await fetch(`https://formsubmit.co/ajax/${siteInfo.contact.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: subject, _template: "table", _captcha: "false", ...fields }),
    })
  } catch {
    /* ignore — the Supabase copy is the source of truth */
  }

  return saved
}
