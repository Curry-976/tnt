import Link from "next/link";
import Image from "next/image";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="panel site-footer">
      <div className="footer-grid">
        <div>
          <Image className="logo" src="/assets/torrow-wordmark.png" alt="TORROW" height={23} width={108} />
          <p className="faint footer-desc">
            Maillots inspirés de Mayotte.
            <br />
            Unis par l’identité, portés
            <br />
            par la fierté.
          </p>
          <div className="social-row faint">
            <a href="#top" aria-label="Instagram">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
                <circle cx="17" cy="7" r="1"></circle>
              </svg>
            </a>
            <a href="#top" aria-label="TikTok">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"></path>
                <path d="M14 7.2c1 1.3 2.4 2 4 2.1"></path>
              </svg>
            </a>
            <a href="#top" aria-label="Twitter">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M21 5.4c-.7.3-1.4.5-2.2.6a3.7 3.7 0 0 0 1.7-2 7.6 7.6 0 0 1-2.4.9 3.8 3.8 0 0 0-6.5 3.4A10.7 10.7 0 0 1 4 4.6a3.8 3.8 0 0 0 1.2 5 3.7 3.7 0 0 1-1.7-.5 3.8 3.8 0 0 0 3 3.7 3.8 3.8 0 0 1-1.7.1 3.8 3.8 0 0 0 3.5 2.6A7.6 7.6 0 0 1 3 17.1a10.7 10.7 0 0 0 5.8 1.7c7 0 10.8-5.8 10.8-10.8v-.5c.8-.5 1.4-1.2 1.9-2z"></path>
              </svg>
            </a>
            <a href="mailto:contact@torrownamtorrow.com" aria-label="Email">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3.5" y="5.5" width="17" height="13" rx="2.5"></rect>
                <path d="m4.5 7.5 7.5 5.5 7.5-5.5"></path>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <div className="footer-heading">Boutique</div>
          <div className="footer-links faint">
            <Link href="/collection">Tous les maillots</Link>
            <Link href="/collection?filtre=home">Domicile</Link>
            <Link href="/collection?filtre=away">Extérieur</Link>
          </div>
        </div>
        <div>
          <div className="footer-heading">Infos</div>
          <div className="footer-links faint">
            <Link href="/a-propos">À propos</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/a-propos#livraison">Livraison &amp; retours</Link>
            <Link href="/a-propos#tailles">Guide des tailles</Link>
          </div>
        </div>
        <div>
          <div className="footer-heading">Compte</div>
          <div className="footer-links faint">
            <Link href="/compte">Connexion</Link>
            <Link href="/compte/inscription">Créer un compte</Link>
            <Link href="/panier">Mon panier</Link>
          </div>
        </div>
        <div className="card newsletter">
          <div className="newsletter-heading">Reste informé</div>
          <p className="faint newsletter-desc">
            Inscris-toi à notre newsletter
            <br />
            pour ne rien manquer.
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className="footer-rule">
        <span className="faint">© TORROW 2026 – Tous droits réservés.</span>
        <div className="footer-legal faint">
          <Link href="/a-propos#mentions-legales">Mentions légales</Link>
          <Link href="/a-propos#cgv">CGV</Link>
        </div>
      </div>
    </footer>
  );
}
