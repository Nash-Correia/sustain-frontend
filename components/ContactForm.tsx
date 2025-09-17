"use client";
import { useState } from "react";

// A simple reusable Input component for consistency
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="mt-1 w-full h-12 rounded-md border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green-light" />
);

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);

    // ===== SIMULATED API CALL =====
    // We'll wait for 1 second (1000 milliseconds) to mimic a real network request.
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate a successful response
    setOk("Thanks! We'll get back within 2–3 business days.");
    (e.target as HTMLFormElement).reset(); // Clear the form on success

    // To test the error state, you could uncomment the line below
    // setErr("Something went wrong. Please try again.");

    setSubmitting(false);


    /*
    // ===== REAL API CALL (for later) =====
    // When the backend is ready, you will uncomment this part and delete the simulation above.
    try {
      const fd = new FormData(e.currentTarget);
      const payload = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        company: String(fd.get("company") || "").trim(),
        subject: String(fd.get("subject") || "").trim(),
        message: String(fd.get("message") || "").trim(),
      };
      
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Contact failed: ${res.status}`);
      
      setOk("Thanks! We'll get back within 2–3 business days.");
      (e.target as HTMLFormElement).reset();

    } catch (error: any) {
      setErr(error?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
    */
  }

  return (
    <section id="contact" className="bg-brand-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-brand-dark">Get in Touch</h2>
            <form onSubmit={onSubmit} className="mt-8 bg-white text-gray-900 rounded-large p-8 shadow-sm space-y-6" noValidate>
                {/* ... form fields remain the same */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                        <Input id="name" name="name" type="text" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                        <Input id="email" name="email" type="email" required />
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="company">Company</label>
                        <Input id="company" name="company" type="text" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="subject">Subject</label>
                        <Input id="subject" name="subject" type="text" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows={5} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green-light" />
                </div>
                <div className="text-center pt-4">
                    <button disabled={submitting} type="submit" className="rounded-md bg-brand-dark px-10 py-3 text-white text-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark disabled:opacity-60 transition-colors">
                        {submitting ? "Submitting…" : "Submit"}
                    </button>
                    {ok && <p className="mt-4 text-sm text-green-700">{ok}</p>}
                    {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
                </div>
            </form>
        </div>
      </div>
    </section>
  );
}