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

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOk("Thanks! We'll get back within 2–3 business days.");
    (e.target as HTMLFormElement).reset();
    setSubmitting(false);
  }

  // Shapes with larger sizes
  const shapes = [
    { className: "bg-green-500/20 rounded-full", top: "5%", left: "7%", width: 80, height: 80, duration: 8 },
    { className: "bg-blue-500/10 rounded-lg", top: "20%", right: "10%", width: 100, height: 100, duration: 9 },
    { className: "bg-purple-500/20", top: "70%", left: "25%", clip: "polygon(50% 0%, 0% 100%, 100% 100%)", width: 90, height: 90, duration: 10 },
    { className: "bg-yellow-500/20 rounded-full", top: "5%", left: "50%", width: 100, height: 100, duration: 7 },
    { className: "bg-red-500/10 rounded-lg", bottom: "20%", right: "33%", width: 90, height: 90, duration: 9 },
    { className: "bg-pink-500/15 rounded-full", top: "10%", right: "40%", width: 110, height: 110, duration: 8 },
    { className: "bg-indigo-500/15 rounded-lg", bottom: "15%", left: "10%", width: 80, height: 80, duration: 9 },
    { className: "bg-teal-500/20 rounded-full", top: "60%", right: "20%", width: 100, height: 100, duration: 7 },
    { className: "bg-orange-500/10 rounded-lg", bottom: "5%", left: "50%", width: 120, height: 120, duration: 10 },
    { className: "bg-cyan-500/20", top: "30%", left: "10%", clip: "polygon(50% 0%, 0% 100%, 100% 100%)", width: 100, height: 100, duration: 8 },
  ];

  return (
    <section className="relative bg-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* --- Animated Shapes --- */}
      {shapes.map((shape, idx) => (
        <motion.div
          key={idx}
          className={`absolute z-0 ${shape.className}`}
          style={{
            top: shape.top,
            bottom: shape.bottom,
            left: shape.left,
            right: shape.right,
            width: `${shape.width}px`,
            height: `${shape.height}px`,
            clipPath: shape.clip || "none",
          }}
          animate={{
            x: [-30, 30, -30],
            y: [-30, 30, -30],
            rotate: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: shape.duration,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* --- Contact Form --- */}
      <div className="relative z-10 mx-auto max-w-4xl bg-white/50 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Get in Touch</h2>
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <textarea
            name="message"
            rows={5}
            placeholder="Message"
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
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
