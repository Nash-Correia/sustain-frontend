"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);

    try {
      const form = e.currentTarget;
      const fd = new FormData(form);

      // REQUIRED: your Web3Forms Access Key (expose via NEXT_PUBLIC_)
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "bd18762e-3479-41e1-a4c0-021ea39a5d6f";
      fd.append("access_key", accessKey);

      // Optional: set reply-to so email replies go to the user
      const email = String(fd.get("Email") || "");
      if (email) fd.append("replyto", email);

      // Optional: set a custom from_name/subject for nicer emails
      const name = String(fd.get("Name") || "");
      const company = String(fd.get("Company") || "");
      const subj = String(fd.get("subject") || "");
      if (name) fd.append("from_name", name);
      if (subj) fd.set("subject", subj || `New contact from ${name} (${company})`);

      // Optional: if your Web3Forms plan supports it, you can force recipient:
      // fd.append("to", "solutions@iias.in");

      // Optional: redirect after success (leave commented to stay on page)
      // fd.append("redirect", "https://yourdomain.com/thanks");

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (data.success) {
        setOk("Thanks! We'll get back within a business days.");
        form.reset();
      } else {
        setErr(data.message || "Submission failed. Please try again.");
      }
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  // Animated shapes (unchanged)
  const shapes = [
    { className: "bg-green-500/20 rounded-full", top: "5%", left: "7%", width: 300, height: 300, duration: 8 },
    { className: "bg-blue-500/10 rounded-lg", top: "20%", right: "10%", width: 150, height: 150, duration: 9 },
    { className: "bg-purple-500/20", top: "70%", left: "25%", clip: "polygon(50% 0%, 0% 100%, 100% 100%)", width: 90, height: 90, duration: 10 },
    { className: "bg-yellow-500/20 rounded-full", top: "5%", left: "70%", width: 200, height: 200, duration: 7 },
    { className: "bg-red-500/10 rounded-lg", bottom: "50%", right: "50%", width: 180, height: 180, duration: 9 },
    { className: "bg-pink-500/15 rounded-full", top: "10%", right: "40%", width: 110, height: 110, duration: 8 },
    { className: "bg-indigo-500/15 rounded-lg", bottom: "15%", left: "10%", width: 80, height: 80, duration: 9 },
    { className: "bg-teal-500/20 rounded-full", top: "60%", right: "20%", width: 100, height: 100, duration: 7 },
    { className: "bg-orange-500/10 rounded-lg", bottom: "5%", left: "50%", width: 120, height: 120, duration: 10 },
    { className: "bg-cyan-500/20", top: "30%", left: "10%", clip: "polygon(50% 0%, 0% 100%, 100% 100%)", width: 100, height: 100, duration: 8 },
  ];

  return (
    <section className="relative bg-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {shapes.map((shape, idx) => (
        <motion.div
          key={idx}
          className={`absolute z-0 ${shape.className}`}
          style={{
            top: (shape as any).top,
            bottom: (shape as any).bottom,
            left: (shape as any).left,
            right: (shape as any).right,
            width: `${shape.width}px`,
            height: `${shape.height}px`,
            clipPath: (shape as any).clip || "none",
          }}
          animate={{ x: [-30, 30, -30], y: [-30, 30, -30], rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: shape.duration, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-4xl bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Get in Touch</h2>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {/* Honeypot for bots */}
          <input type="text" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

          {/* Name & Company */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="Name"
                placeholder="Enter Name"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                name="Company"
                placeholder="Enter company name"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Email & Contact */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="Email"
                placeholder="Enter email"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
              <input
                type="text"
                name="Contact"
                placeholder="Enter Contact no."
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-green-600 px-10 py-3 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
            {ok && <p className="mt-4 text-sm text-green-700">{ok}</p>}
            {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
