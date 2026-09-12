"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

type NavLink = { href: string; label: string };

function MenuChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M9 5l7 7-7 7"></path>
    </svg>
  );
}

export function MobileMenu({ links, extraLinks = [] }: { links: NavLink[]; extraLinks?: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="nav-hamburger"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M5 5l14 14M19 5 5 19"></path>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18"></path>
          </svg>
        )}
      </button>

      {open && (
        <nav className="mobile-menu-panel" aria-label="Menu principal">
          {links.map((link) => (
            <Link key={link.href + link.label} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
              <MenuChevron />
            </Link>
          ))}
          {extraLinks.map((link) => (
            <Link key={link.href + link.label} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
              <MenuChevron />
            </Link>
          ))}
          <div className="mobile-menu-row">
            <span>Thème</span>
            <ThemeToggle />
          </div>
          <div className="mobile-menu-cta">
            <p>Crée ton compte pour suivre tes commandes et retrouver tes favoris partout.</p>
            <Link href="/compte/inscription" className="cta small" onClick={() => setOpen(false)}>
              <span>Créer un compte</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
