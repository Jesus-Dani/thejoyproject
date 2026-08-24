"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organization: organization || undefined, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong — please try again.");
        setStatus("error");
      } else {
        setStatus("sent");
      }
    } catch {
      setError("Something went wrong — please try again.");
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-card border border-navy/10 bg-white p-6">
        <p className="font-bold text-navy">Thanks — we&rsquo;ve got your message.</p>
        <p className="mt-1 text-sm text-navy/70">The organizing team will get back to you directly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-navy/10 bg-white p-6">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-navy/70">
          Name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-button border border-navy/20 px-3 py-2.5 text-navy"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-navy/70">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-button border border-navy/20 px-3 py-2.5 text-navy"
        />
      </div>
      <div>
        <label htmlFor="organization" className="text-sm font-medium text-navy/70">
          Organization / brand <span className="text-navy/40">(optional)</span>
        </label>
        <input
          id="organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="mt-1 w-full rounded-button border border-navy/20 px-3 py-2.5 text-navy"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-navy/70">
          What are you thinking?
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-button border border-navy/20 px-3 py-2.5 text-navy"
        />
      </div>
      {error && <p className="rounded-button bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-button bg-navy px-6 py-3 text-sm font-bold text-cream transition-colors hover:bg-navy/90 disabled:opacity-50"
      >
        {submitting ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
