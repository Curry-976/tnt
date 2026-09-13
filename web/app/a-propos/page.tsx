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
          partager avec celles et ceux qui s’y reconnaissent. Pas une marque de sport de plus, un mouvement.
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
          La livraison en DOM-TOM n’est pas disponible pour l’instant, on y travaille.
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
          Torrow Nam Torrow : site en cours de mise en ligne. Les informations légales complètes (raison
          sociale, SIRET, siège social, hébergeur) seront publiées ici avant l’ouverture des ventes.
        </p>
      </div>

      <div id="cgv" className="panel about-section">
        <h2>Conditions générales de vente</h2>

        <p className="form-note" style={{ marginBottom: 20 }}>
          L’identité complète du vendeur (raison sociale, SIRET) sera ajoutée à l’article 1 dès
          l’immatriculation de l’activité, avant l’ouverture des ventes réelles.
        </p>

        <h3>Article 1 — Identification du vendeur</h3>
        <p className="prose">
          Torrow Nam Torrow — [nom, SIRET et adresse du siège à compléter après immatriculation],
          ci-après « le vendeur ». Contact :{" "}
          <a href="/contact" style={{ textDecoration: "underline" }}>page Contact</a>.
        </p>

        <h3>Article 2 — Objet</h3>
        <p className="prose">
          Les présentes conditions régissent les ventes de maillots streetwear Torrow Nam Torrow
          réalisées sur ce site auprès de particuliers consommateurs. Passer commande vaut
          acceptation pleine et entière de ces conditions.
        </p>

        <h3>Article 3 — Produits et personnalisation</h3>
        <p className="prose">
          Chaque maillot est proposé en plusieurs tailles (voir le guide des tailles ci-dessus),
          avec en option un flocage nom et numéro choisi par le client. Les maillots sont fabriqués
          à la commande.
        </p>

        <h3>Article 4 — Prix</h3>
        <p className="prose">
          Prix indiqués en euros, toutes taxes comprises : 35 € le maillot, option flocage nom et
          numéro à 5 € supplémentaires. Les frais de livraison, s’il y en a, sont précisés avant la
          validation de la commande.
        </p>

        <h3>Article 5 — Commande et paiement</h3>
        <p className="prose">
          La commande se fait en sélectionnant une taille et, le cas échéant, l’option flocage, puis
          en réglant par carte bancaire via une passerelle de paiement sécurisée (Stripe). Le
          paiement est débité à la validation de la commande. Un email de confirmation est envoyé
          après paiement.
        </p>

        <h3>Article 6 — Livraison</h3>
        <p className="prose">
          Livraison en France métropolitaine uniquement pour l’instant, sous 15 à 20 jours (chaque
          maillot étant fabriqué à la commande). La livraison en DOM-TOM n’est pas disponible pour
          le moment.
        </p>

        <h3>Article 7 — Droit de rétractation</h3>
        <p className="prose">
          Conformément à l’article L221-18 du Code de la consommation, le client dispose de 14 jours
          à compter de la réception d’un maillot <strong>sans flocage</strong> pour exercer son droit
          de rétractation, sans avoir à justifier de motif, en écrivant depuis la page{" "}
          <a href="/contact" style={{ textDecoration: "underline" }}>Contact</a>. L’article doit être
          retourné non porté, dans son état d’origine.
        </p>
        <p className="prose">
          Conformément à l’article L221-28 13° du Code de la consommation, ce droit de rétractation
          <strong> ne s’applique pas</strong> aux maillots floqués avec un nom et un numéro choisis
          par le client, ces produits étant confectionnés selon ses spécifications et nettement
          personnalisés.
        </p>

        <h3>Article 8 — Garanties légales</h3>
        <p className="prose">
          Tout maillot bénéficie de la garantie légale de conformité (articles L217-3 et suivants du
          Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et
          suivants du Code civil), sans surcoût. En cas de défaut, contacte-nous depuis la page{" "}
          <a href="/contact" style={{ textDecoration: "underline" }}>Contact</a>.
        </p>

        <h3>Article 9 — Réclamations et litiges</h3>
        <p className="prose">
          Pour toute question ou réclamation, écris-nous depuis la page{" "}
          <a href="/contact" style={{ textDecoration: "underline" }}>Contact</a> ; on répond sous
          48h. Les coordonnées d’un médiateur de la consommation seront ajoutées ici une fois
          l’activité immatriculée. Les présentes conditions sont soumises au droit français.
        </p>
      </div>
    </>
  );
}
