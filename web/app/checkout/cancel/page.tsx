import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Paiement annulé" };

export default function CheckoutCancelPage() {
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Checkout</div>
        <h1 className="page-title">Paiement annulé</h1>
      </div>
      <div className="panel" style={{ textAlign: "center", padding: 60 }}>
        <p className="faint">Ton panier est toujours là, rien n’a été débité.</p>
        <Link href="/panier" className="cta" style={{ marginTop: 20, display: "inline-flex" }}>
          <span>Retour au panier</span>
        </Link>
      </div>
    </>
  );
}
