import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Erreur 404</div>
        <h1 className="page-title">Cette page n’existe pas.</h1>
        <p className="page-lede">
          Le lien est peut-être cassé, ou le maillot que tu cherchais n’est plus disponible.
        </p>
      </div>
      <div className="panel" style={{ textAlign: "center", padding: 60 }}>
        <p className="faint" style={{ marginTop: 0 }}>
          Retourne à l’accueil ou jette un œil à la collection.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          <Link href="/" className="ghost" style={{ display: "inline-flex" }}>
            <span>Accueil</span>
          </Link>
          <Link href="/collection" className="cta" style={{ display: "inline-flex" }}>
            <span>Voir la collection</span>
          </Link>
        </div>
      </div>
    </>
  );
}
