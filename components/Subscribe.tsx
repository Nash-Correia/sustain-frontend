"use client";
import { useState } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Your subscribe logic can be added here
    alert(`Subscribing with: ${email}`);
    setEmail('');
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-dark">Subscribe. Never miss an update.</h2>
            <form className="mt-8 mx-auto max-w-2xl flex flex-col sm:flex-row items-center gap-4" onSubmit={onSubmit}>
                <label htmlFor="subscribe-email" className="sr-only">Enter your email</label>
                <input
                    id="subscribe-email"
                    type="email"
                    required
                    placeholder="Enter your email ID"
                    className="flex-1 w-full h-12 rounded-md border border-gray-300 bg-white px-4 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green-light"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex items-center gap-4">
                    <button type="submit" className="h-12 rounded-md bg-brand-dark px-6 text-white font-semibold hover:bg-gray-800 transition-colors">
                        Subscribe
                    </button>
                    <a href="#contact" className="h-12 inline-flex items-center rounded-md bg-brand-green-light px-6 text-white font-semibold hover:bg-opacity-90 transition-opacity">
                        Contact Us
                    </a>
                </div>
            </form>
        </div>
    </section>
  );
}