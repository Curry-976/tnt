"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

type NavLink = { href: string; label: string };

const SECONDARY_LINKS = [
  {
    href: "/panier",
    label: "Panier",
    icon: (
      <path d="M3 5h2.2l2.3 10.6h10l1.9-7.6H6.4M9.5 19.3a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6ZM17.5 19.3a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z"></path>
    ),
  },
  {
    href: "/compte/tableau-de-bord",
    label: "Commandes",
    icon: <path d="M4.5 8.5 12 4l7.5 4.5v8L12 21l-7.5-4.5v-8ZM4.5 8.5 12 13l7.5-4.5M12 13v8"></path>,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: <path d="M3 5h18v14H3V5Zm0 0 9 7 9-7"></path>,
  },
];

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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18"></path>
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

          <div className="mobile-menu-auth">
            <Link href="/compte" className="ghost" onClick={() => setOpen(false)}>
              Connexion
            </Link>
            <Link href="/compte/inscription" className="cta" onClick={() => setOpen(false)}>
              <span>Inscription</span>
            </Link>
          </div>

          <div className="mobile-menu-secondary">
            {SECONDARY_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  {link.icon}
                </svg>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mobile-menu-row">
            <span>Thème</span>
            <ThemeToggle />
          </div>
        </nav>
      )}
    </div>
  );
}
