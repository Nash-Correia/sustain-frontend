
"use client";
import React, { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import MultiSelect from "@/components/product/MultiSelect";

const EMAIL_RE = /^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;

export type RequestModalProps = {
  open: boolean;
  onClose: () => void;
  // when user clicked Download on a specific company row
  defaultCompany?: string;
  year: number; // 2024 or 2023
  loggedIn?: boolean; // if true → hide personal fields
  companyOptions: string[]; // for multi-select
};

export default function RequestReportModal({ open, onClose, defaultCompany, year, loggedIn = false, companyOptions }: RequestModalProps) {
  const [isSubscriber, setIsSubscriber] = useState(true);
  const [companies, setCompanies] = useState<string[]>(defaultCompany ? [defaultCompany] : []);

  // personal fields (only when NOT logged in)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const valid = useMemo(() => {
    if (!agree) return false;
    if (companies.length === 0) return false;
    if (loggedIn) return true;
    return !!name && EMAIL_RE.test(email) && !!phone;
  }, [agree, companies, loggedIn, name, email, phone]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setOk(null);
    if (!valid) return;
    setSubmitting(true);
    try {
      const payload = {
        isSubscriber,
        year,
        companies,
        name: loggedIn ? undefined : name,
        email: loggedIn ? undefined : email,
        organization: loggedIn ? undefined : org,
        phone: loggedIn ? undefined : phone,
        country: loggedIn ? undefined : country,
      };

      // ===== BACKEND PREP: uncomment below to connect
      // const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      // const res = await fetch(`${BASE}/api/request-report`, {
      //   method: 'POST', headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include', body: JSON.stringify(payload)
      // });
      // if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      await new Promise((r) => setTimeout(r, 400)); // simulate
      setOk("Request received. We will email you shortly.");
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={submit} className="p-6">
        {/* Top checkbox */}
        <label className="inline-flex items-center gap-2 text-[14px] text-gray-700">
          <input type="checkbox" checked={isSubscriber} onChange={(e)=>setIsSubscriber(e.target.checked)} />
          I am a Subscriber/Investor
        </label>

        {/* Fields (hide when logged in) */}
        {!loggedIn && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] text-gray-700">Full Name *</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900" placeholder="Enter Name" />
            </div>
            <div>
              <label className="block text-[13px] text-gray-700">Email *</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900" placeholder="Enter Email" />
            </div>
            <div>
              <label className="block text-[13px] text-gray-700">Organization</label>
              <input value={org} onChange={(e)=>setOrg(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900" placeholder="Enter Name" />
            </div>
            <div>
              <label className="block text-[13px] text-gray-700">Phone *</label>
              <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900" placeholder="Enter Phone" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[13px] text-gray-700">Country</label>
              <input value={country} onChange={(e)=>setCountry(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900" placeholder="Enter Country" />
            </div>
          </div>
        )}

        {/* Company select + Select All */}
        <div className="mt-4 grid grid-cols-[1fr_auto] items-start gap-3">
          <MultiSelect options={companyOptions} selected={companies} onChange={setCompanies} />
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-[14px] text-gray-800 hover:bg-gray-50"
            onClick={() => setCompanies(companies.length === companyOptions.length ? [] : companyOptions)}
          >
            {companies.length === companyOptions.length ? "Clear All" : "Select All"}
          </button>
        </div>

        {/* Terms checkbox */}
        <label className="mt-4 block text-[12px] text-gray-700">
          <input type="checkbox" className="mr-2 align-middle" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
          By checking the box below, I confirm that I have read, understood, and agree to all the terms and
          conditions presented. I acknowledge that I am responsible for providing accurate and complete
          information and that my use of this service is subject to these terms.
        </label>

        {/* Actions */}
        <div className="mt-5">
          <button
            type="submit"
            disabled={!valid || submitting}
            className="mx-auto block rounded-lg bg-[#22C55E] px-5 py-2 text-white shadow disabled:opacity-60"
          >
            {submitting ? "Requesting…" : "Request Report"}
          </button>
          {ok && <p className="mt-2 text-center text-sm text-green-700">{ok}</p>}
          {err && <p className="mt-2 text-center text-sm text-red-600">{err}</p>}
        </div>
      </form>
    </Modal>
  );
}
