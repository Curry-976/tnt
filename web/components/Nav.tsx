import Link from "next/link";
import Image from "next/image";
import { CartLink } from "./CartLink";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/collection", label: "Maillots" },
  { href: "/collection", label: "Collection" },
  { href: "/a-propos", label: "À propos" },
];

export function Nav() {
  return (
    <header className="nav">
      <div className="nav-left">
        <Link href="/" aria-label="Accueil Torrow Nam Torrow" className="logo-link">
          <Image className="logo" src="/assets/torrow-wordmark.png" alt="TORROW" height={26} width={122} priority />
        </Link>
      </div>
      <div className="nav-right">
        <Link href="/collection" className="nav-action" aria-label="Rechercher" title="Rechercher">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="10.5" cy="10.5" r="6.5"></circle>
            <path d="M15.5 15.5 21 21"></path>
          </svg>
        </Link>
        <Link href="/compte" className="nav-action" aria-label="Mon compte" title="Mon compte">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4.5 21c0-4.1 3.4-6.5 7.5-6.5s7.5 2.4 7.5 6.5"></path>
          </svg>
        </Link>
        <CartLink />
        <MobileMenu links={NAV_LINKS} />
      </div>
    </header>
  );
}
