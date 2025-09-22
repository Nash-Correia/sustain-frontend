"use client";
import { useState } from "react";
import { clsx } from "@/lib/utils";

// --- SVG Icons ---
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);
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

    // --- SIMULATED API CALL ---
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
        }, 3000); // Reset after 3 seconds
    }
  }

  return (
    <section className="bg-brand-bg-light py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-brand-dark">Subscribe. Never miss an update.</h2>
            <p className="mt-2 text-gray-600">Get the latest insights and updates from IiAS directly in your inbox.</p>
            
            <div className="mt-8 max-w-lg mx-auto">
                <form className="flex items-center gap-2" onSubmit={onSubmit}>
                    <div className="relative flex-1">
                      <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="you@company.com"
                        className="w-full h-12 rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'submitting'}
                      />
                    </div>
                    <button 
                      className={clsx(
                        "h-12 rounded-md bg-brand-dark px-6 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark",
                        status === 'submitting' ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-gray-800'
                      )}
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? "..." : "Subscribe"}
                    </button>
                </form>
                <div className="h-6 mt-2 text-sm">
                    {status === 'success' && (
                        <p className="text-green-600 flex items-center justify-center gap-2">
                            <CheckCircleIcon className="h-5 w-5" />
                            {message}
                        </p>
                    )}
                    {status === 'error' && (
                        <p className="text-red-600 flex items-center justify-center gap-2">
                            <ExclamationCircleIcon className="h-5 w-5" />
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    </section>
  );
}
