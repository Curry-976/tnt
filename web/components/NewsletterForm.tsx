"use client";

import { useActionState } from "react";
import { subscribeToNewsletterAction, type ActionState } from "@/lib/actions/newsletter";

const initialState: ActionState = { error: null };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletterAction, initialState);

  if (state.success) {
    return <p className="faint newsletter-desc">Merci, à bientôt dans ta boîte mail !</p>;
  }

  return (
    <form className="field" action={formAction}>
      <input type="email" name="email" placeholder="Ton email" required />
      <button type="submit" className="cta icon-only" aria-label="S'inscrire" disabled={pending}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12h15M13 6l6 6-6 6"></path>
        </svg>
      </button>
      {state.error && <p className="form-error">{state.error}</p>}
    </form>
  );
}
