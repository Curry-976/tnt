import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "À propos",
  description: "L'histoire de Torrow Nam Torrow, la team derrière les maillots.",
};

export default function AProposPage() {
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">À propos</div>
        <h1 className="page-title">On est la team.</h1>
        <p className="page-lede">
          Torrow Nam Torrow est né d’une envie simple : porter l’identité de Mayotte sur un maillot, et la
          partager avec celles et ceux qui s’y reconnaissent. Pas une marque de sport de plus — un mouvement.
        </p>
      </div>

      <div className="panel" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 32, alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>Une histoire, un territoire</h2>
          <p className="prose">
            Chaque maillot Torrow Nam Torrow part d’un détail réel : un écusson brodé, une teinte, un motif
            inspiré du lagon ou de la forêt. On dessine à partir de ce qu’on connaît, pour des gens qui le
            reconnaissent tout de suite.
          </p>
          <p className="prose">
            La team, c’est aussi la communauté qui porte les maillots : les photos qu’on nous envoie, les
            retours qui font évoluer les prochaines collections, les retrouvailles autour d’un match. On
            construit ça ensemble, saison après saison.
          </p>
        </div>
        <div style={{ position: "relative", height: 320, borderRadius: 18, overflow: "hidden" }}>
          <Image src="/assets/hero-05.jpg" alt="La communauté Torrow Nam Torrow" fill sizes="(max-width: 1080px) 100vw, 45vw" />
        </div>
      </div>

      <div id="livraison" className="panel about-section">
        <h2>Livraison &amp; retours</h2>
        <p className="prose">
          Livraison en France métropolitaine sous 15 à 20 jours (chaque pièce est floquée à la commande).
          La livraison en DOM-TOM n’est pas disponible pour l’instant — on y travaille.
        </p>
        <p className="prose">
          Un problème avec ta commande ? Écris-nous depuis la page{" "}
          <a href="/contact" style={{ textDecoration: "underline" }}>Contact</a> avec ton numéro de commande,
          on te répond sous 48h.
        </p>
      </div>

      <div id="tailles" className="panel about-section">
        <h2>Guide des tailles</h2>
        <table className="size-table">
          <thead>
            <tr>
              <th>Taille</th>
              <th>Tour de poitrine</th>
              <th>Longueur</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>XS</td><td>84–88 cm</td><td>66 cm</td></tr>
            <tr><td>S</td><td>89–93 cm</td><td>68 cm</td></tr>
            <tr><td>M</td><td>94–98 cm</td><td>70 cm</td></tr>
            <tr><td>L</td><td>99–104 cm</td><td>72 cm</td></tr>
            <tr><td>XL</td><td>105–111 cm</td><td>74 cm</td></tr>
            <tr><td>XXL</td><td>112–118 cm</td><td>76 cm</td></tr>
          </tbody>
        </table>
        <p className="form-note" style={{ marginTop: 12 }}>
          Coupe standard, légèrement ample. Entre deux tailles ? On te conseille de prendre la taille au-dessus.
        </p>
      </div>

      <div id="mentions-legales" className="panel about-section">
        <h2>Mentions légales</h2>
        <p className="prose">
          Torrow Nam Torrow — site en cours de mise en ligne. Les informations légales complètes (raison
          sociale, SIRET, siège social, hébergeur) seront publiées ici avant l’ouverture des ventes.
        </p>
      </div>

      <div id="cgv" className="panel about-section">
        <h2>Conditions générales de vente</h2>
        <p className="prose">
          Les CGV détaillées (droit de rétractation, modalités de paiement et de livraison, garanties)
          seront publiées ici avant l’ouverture des ventes.
        </p>
      </div>
    </>
  );
}
