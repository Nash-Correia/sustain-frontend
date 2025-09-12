"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Frontend-only for now
    // When backend is ready, uncomment:
    // await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newsletter`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email }),
    // });
  }

  return (
    <form className="mt-3 flex gap-2" onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="you@company.com"
        className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="rounded-xl bg-teal-600 px-4 py-2 text-white">Subscribe</button>
    </form>
  );
}
