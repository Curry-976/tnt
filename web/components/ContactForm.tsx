"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Impossible d'envoyer le message pour l'instant, réessaie plus tard.");
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="panel" style={{ textAlign: "center", padding: 48 }}>
        <p>Merci, ton message est bien parti. On te répond sous 48h.</p>
      </div>
    );
  }

  return (
    <form className="panel auth-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="form-label" htmlFor="contact-name">Nom</label>
        <input
          id="contact-name"
          name="name"
          className="form-input"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-row">
        <label className="form-label" htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          className="form-input"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-row">
        <label className="form-label" htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          className="form-input"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="cta" disabled={loading}>
        <span>{loading ? "Envoi…" : "Envoyer"}</span>
      </button>
    </form>
  );
}
