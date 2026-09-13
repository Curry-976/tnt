"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Tableau de bord",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
        <rect x="13" y="3.5" width="7.5" height="4.5" rx="1.5" />
        <rect x="13" y="10" width="7.5" height="10.5" rx="1.5" />
        <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/clients",
    label: "Clients",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21c0-4.1 3.4-6.5 7.5-6.5s7.5 2.4 7.5 6.5" />
      </svg>
    ),
  },
  {
    href: "/admin/commandes",
    label: "Commandes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 7.5h16l-1.4 11.2a1.5 1.5 0 0 1-1.5 1.3H6.9a1.5 1.5 0 0 1-1.5-1.3L4 7.5Z" />
        <path d="M8.5 7.5V6a3.5 3.5 0 0 1 7 0v1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
        <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
      </svg>
    ),
  },
];

export function AdminSidebar({
  name,
  initials,
  hasUnhandled,
}: {
  name: string;
  initials: string;
  hasUnhandled: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-wordmark">TORROW</div>
      <nav className="admin-nav">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`admin-nav-item${active ? " active" : ""}`}>
              {item.icon}
              <span>{item.label}</span>
              {item.href === "/admin/messages" && hasUnhandled && <span className="admin-nav-dot" />}
            </Link>
          );
        })}
        <div className="admin-nav-divider" />
        <a href="/studio" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 8.5 12 4l8 4.5-8 4.5-8-4.5Z" />
            <path d="M4 8.5v7L12 20l8-4.5v-7" />
            <path d="M12 13v7" />
          </svg>
          <span>Produits</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="admin-nav-external" style={{ marginLeft: "auto", flexShrink: 0, opacity: 0.6 }}>
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
      </nav>
      <div className="admin-avatar-block">
        <div className="admin-avatar">{initials}</div>
        <div>
          <div className="admin-avatar-name">{name}</div>
          <div className="admin-avatar-role">Administration</div>
        </div>
      </div>
    </aside>
  );
}
