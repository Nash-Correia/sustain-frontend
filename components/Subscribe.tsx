"use client";
import { useState } from "react";
import { clsx } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- SVG Icons ---
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const ExclamationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    
    if (email.includes('error')) {
      setStatus('error');
      setMessage('Could not subscribe. Please try again.');
    } else {
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Centered and slightly smaller section */}
      <section className="relative bg-teal-btn text-white rounded-3xl py-16 px-6 sm:px-8 max-w-5xl mx-auto overflow-hidden">
        {/* Animated Background Shapes */}
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 border-4 border-white/30 rounded-full"
          animate={{
            scale: [0.9, 1.1, 0.9],
            x: [0, 20, 0],
            y: [0, 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-12 w-80 h-80 border-4 border-white/30 rounded-full"
          animate={{
            scale: [0.9, 1.1, 0.9],
            x: [0, -20, 0],
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 w-40 h-40 border-4 border-white/20"
          animate={{
            rotate: [0, 45, 0],
            scale: [0.8, 1.2, 0.8],
            x: [-30, 30, -30],
            y: [-20, 20, -20],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.svg
          className="absolute -top-10 right-1/4 w-60 h-60"
          viewBox="0 0 100 100"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeOpacity={0.3}
          animate={{
            rotate: [0, 10, -10, 0],
            x: [0, 15, -15, 0],
            y: [0, -10, 10, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M10 50 Q25 10, 50 50 T90 50" />
        </motion.svg>

        <motion.div className="relative z-10 text-center" variants={formVariants} initial="hidden" animate="visible">
          <h2 className="text-4xl sm:text-5xl font-bold">Subscribe. Never miss an update.</h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Get the latest insights and updates from IiAS directly in your inbox.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <form className="flex w-full max-w-md" onSubmit={onSubmit}>
              <input
                type="email"
                placeholder="Enter your email ID"
                className="flex-1 h-14 rounded-l-full border-0 bg-white/90 px-6 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'submitting'}
              />
              <button 
                type="submit"
                className={clsx(
                  "h-14 rounded-r-full bg-brand-dark px-8 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark",
                  status === 'submitting' ? 'bg-gray-700 cursor-not-allowed' : 'hover:bg-gray-800'
                )}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? "..." : "Subscribe"}
              </button>
            </form>
          </div>

          <div className="h-6 mt-4 text-sm">
            <AnimatePresence>
              {status === 'success' && (
                <motion.p
                  className="text-green-300 flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  {message}
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  key="error"
                  className="text-red-300 flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <ExclamationCircleIcon className="h-5 w-5" />
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
