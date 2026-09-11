"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="panel" style={{ textAlign: "center", padding: 48 }}>
        <p>Merci, ton message est bien parti. On te répond sous 48h.</p>
      </div>
    );
  }

  return (
    <form
      className="panel auth-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="form-row">
        <label className="form-label" htmlFor="contact-name">Nom</label>
        <input id="contact-name" name="name" className="form-input" required />
      </div>
      <div className="form-row">
        <label className="form-label" htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" className="form-input" required />
      </div>
      <div className="form-row">
        <label className="form-label" htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" className="form-input" rows={5} required />
      </div>
      <button type="submit" className="cta">
        <span>Envoyer</span>
      </button>
    </form>
  );
}
