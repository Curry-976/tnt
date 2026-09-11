"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return <p className="faint newsletter-desc">Merci, à bientôt dans ta boîte mail !</p>;
  }

  return (
    <form
      className="field"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <input type="email" name="email" placeholder="Ton email" required />
      <button type="submit" className="cta icon-only" aria-label="S'inscrire">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12h15M13 6l6 6-6 6"></path>
        </svg>
      </button>
    </form>
  );
}
