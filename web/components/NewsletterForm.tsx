"use client";

import { useActionState, useState } from "react";
import { subscribeToNewsletterAction, type ActionState } from "@/lib/actions/newsletter";
import { TurnstileWidget } from "./TurnstileWidget";

const initialState: ActionState = { error: null };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletterAction, initialState);
  const [website, setWebsite] = useState(""); // honeypot
  const [renderedAt] = useState(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  if (state.success) {
    return <p className="faint newsletter-desc">Merci, à bientôt dans ta boîte mail !</p>;
  }

  return (
    <form className="field" action={formAction}>
      <input type="email" name="email" placeholder="Ton email" required />
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="newsletter-website">Site web</label>
        <input
          id="newsletter-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <input type="hidden" name="renderedAt" value={renderedAt} />
      <input type="hidden" name="turnstileToken" value={turnstileToken ?? ""} />
      <TurnstileWidget onToken={setTurnstileToken} />
      <button type="submit" className="cta icon-only" aria-label="S'inscrire" disabled={pending}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12h15M13 6l6 6-6 6"></path>
        </svg>
      </button>
      {state.error && <p className="form-error">{state.error}</p>}
    </form>
  );
}
