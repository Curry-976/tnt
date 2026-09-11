"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/panier" className="nav-action" aria-label={`Panier (${count})`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M3 5h2.2l2.3 10.6h10l1.9-7.6H6.4"></path>
        <circle cx="9.5" cy="19.3" r="1.3"></circle>
        <circle cx="17.5" cy="19.3" r="1.3"></circle>
      </svg>
      <span>Panier{count > 0 ? ` (${count})` : ""}</span>
    </Link>
  );
}
