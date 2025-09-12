"use client";
import { useState } from "react";

const EMAIL_RE = /^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(null); setErr(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      organization: String(fd.get("organization") || "").trim() || undefined,
      subject: String(fd.get("subject") || "").trim() || undefined,
      message: String(fd.get("message") || "").trim(),
    };

    if (!payload.name || !EMAIL_RE.test(payload.email) || !payload.message) {
      setErr("Please provide your name, a valid email, and a message.");
      return;
    }

    // Defense-in-depth: strip script tags
    payload.message = payload.message.replace(/<\/?script[^>]*>/gi, "");

    setSubmitting(true);
    try {
      // ===== BACKEND PREP (COMMENTED) =====
      // const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      // const res = await fetch(`${BASE_URL}/api/contact`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   // credentials: "include", // if you use cookie sessions/CSRF later
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error(`Contact failed: ${res.status}`);
      // const data = await res.json();

      await new Promise((r) => setTimeout(r, 400)); // simulate
      setOk("Thanks! We\'ll get back within 2–3 business days.");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setErr(error?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="bg-teal-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="mt-2 text-teal-100">We’ll get back within 2–3 business days.</p>
          </div>

          <form onSubmit={onSubmit} className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                <input id="name" name="name" type="text" required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" placeholder="Your name"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" placeholder="you@company.com"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="organization">Organization</label>
              <input id="organization" name="organization" type="text" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" placeholder="Company name"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" placeholder="How can we help?"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={4} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" placeholder="Tell us a bit about your needs"/>
            </div>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300"/> I agree to the privacy policy
              </label>
              <button disabled={submitting} type="submit" className="rounded-2xl bg-teal-800 px-5 py-2.5 text-white text-sm font-medium hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 disabled:opacity-60">
                {submitting ? "Sending…" : "Send"}
              </button>
            </div>
            {ok && <p className="text-sm text-green-700">{ok}</p>}
            {err && <p className="text-sm text-red-600">{err}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

