import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Contact</div>
        <h1 className="page-title">Une question ?</h1>
        <p className="page-lede">
          Commande, taille, livraison, partenariat — écris-nous, on te répond sous 48h.
        </p>
      </div>

      <div className="contact-layout">
        <ContactForm />

        <div className="panel">
          <h2 style={{ margin: 0, fontSize: 20 }}>Nous joindre directement</h2>
          <div className="contact-info-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="3.5" y="5.5" width="17" height="13" rx="2.5"></rect>
              <path d="m4.5 7.5 7.5 5.5 7.5-5.5"></path>
            </svg>
            <a href="mailto:contact@torrownamtorrow.com">contact@torrownamtorrow.com</a>
          </div>
          <div className="contact-info-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17" cy="7" r="1"></circle>
            </svg>
            <span className="faint">@torrownamtorrow sur Instagram</span>
          </div>
          <p className="form-note" style={{ marginTop: 20 }}>
            Livraison en France métropolitaine 15 à 20 jours. Non disponible en DOM-TOM pour l’instant.
          </p>
        </div>
      </div>
    </>
  );
}
