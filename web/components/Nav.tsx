import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { CartLink } from "./CartLink";
import { FavoritesLink } from "./FavoritesLink";
import { SearchBox } from "./SearchBox";
import { MobileSearch } from "./MobileSearch";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/collection", label: "Maillots" },
  { href: "/collection", label: "Collection" },
  { href: "/a-propos", label: "À propos" },
];

const MOBILE_MENU_EXTRA_LINKS = [{ href: "/favoris", label: "Favoris" }];

export function Nav() {
  return (
    <header className="nav">
      <div className="nav-left">
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
        <Suspense fallback={<div className="nav-search-form" />}>
          <SearchBox />
        </Suspense>
        <MobileSearch />
        <FavoritesLink />
        <Link href="/compte" className="nav-action" aria-label="Mon compte" title="Mon compte">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4.5 21c0-4.1 3.4-6.5 7.5-6.5s7.5 2.4 7.5 6.5"></path>
          </svg>
        </Link>
        <CartLink />
        <ThemeToggle />
        <MobileMenu links={NAV_LINKS} extraLinks={MOBILE_MENU_EXTRA_LINKS} />
      </div>
    </header>
  );
}
