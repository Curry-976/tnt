import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
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
        <MobileMenu links={NAV_LINKS} />
        <Link href="/" aria-label="Accueil Torrow Nam Torrow" className="logo-link">
          <Image className="logo" src="/assets/torrow-wordmark.png" alt="TORROW" height={26} width={122} priority />
        </Link>
      </div>
      <nav className="navlinks">
        {NAV_LINKS.map((link) => (
          <Link key={link.href + link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="nav-right">
        <Link href="/contact" className="nav-action nav-contact">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <circle cx="10.5" cy="10.5" r="6.5"></circle>
            <path d="M15.5 15.5 21 21"></path>
          </svg>
          <span>Contact</span>
        </Link>
        <Link href="/collection" className="nav-action nav-search" aria-label="Rechercher" title="Rechercher">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <circle cx="10.5" cy="10.5" r="6.5"></circle>
            <path d="M15.5 15.5 21 21"></path>
          </svg>
        </Link>
        <CartLink />
        <Link href="/compte" className="iconbtn" aria-label="Mon compte" title="Mon compte">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4.5 21c0-4.1 3.4-6.5 7.5-6.5s7.5 2.4 7.5 6.5"></path>
          </svg>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
