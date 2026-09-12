import Image from "next/image";
import Link from "next/link";
import { BASE_PRICE, FLOQUAGE_PRICE } from "@/lib/products";
import { getAllProducts } from "@/sanity/lib/queries";

export default async function HomePage() {
  const homeProducts = (await getAllProducts()).filter((p) => p.season === "ete").slice(0, 5);

  return (
    <>
      <div className="hero">
        <div className="hero-bg hero-bg-dark">
          <Image src="/assets/hero-06.jpg" alt="" fill sizes="100vw" priority />
        </div>
        <div className="hero-bg hero-bg-light">
          <Image src="/assets/hero-03.jpg" alt="" fill sizes="100vw" priority />
        </div>
        <div className="hero-scrim" />

        <div className="hero-grid">
          <div className="hero-copy">
            <h1
              className="hero-title"
              data-dark="Maillots inspirés d’un territoire, portés par une identité."
              data-light="L’identité en mode été."
            >
              L’identité en mode été.
            </h1>
            <p
              className="hero-sub"
              data-dark="Des maillots uniques où culture, histoire et design se rencontrent."
              data-light="Des maillots inspirés d’un territoire qui respire la culture, le soleil et la fierté."
            >
              Des maillots inspirés d’un territoire qui respire la culture, le soleil et la fierté.
            </p>
            <div className="hero-actions">
              <Link href="/collection" className="cta">
                <span>Découvrir la collection</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12h15M13 6l6 6-6 6"></path>
                </svg>
              </Link>
              <Link href="/a-propos" className="ghost">
                En savoir plus
              </Link>
            </div>
            <div className="proof">
              <div className="avatars">
                <div className="avatar">
                  <Image src="/assets/hero-01.jpg" alt="Client 1" fill sizes="34px" />
                </div>
                <div className="avatar">
                  <Image src="/assets/hero-02.jpg" alt="Client 2" fill sizes="34px" />
                </div>
                <div className="avatar">
                  <Image src="/assets/hero-05.jpg" alt="Client 3" fill sizes="34px" />
                </div>
              </div>
              <div className="proof-text">
                <span className="proof-title">+1200 clients satisfaits</span>
                <span className="faint">Rejoins la communauté</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-jersey">
              <Image src="/assets/jersey-hanger.jpg" alt="Maillot Torrow Nam Torrow" fill sizes="50vw" />
            </div>
            <div className="rating">
              <div className="star">★</div>
              <div className="rating-score">4.9/5</div>
              <div className="faint">Basé sur 380 avis</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel guarantees">
        <div className="guarantee">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3l7.5 3v5.4c0 4.4-3.1 7.9-7.5 9.3-4.4-1.4-7.5-4.9-7.5-9.3V6z"></path>
          </svg>
          <div>
            <div className="guarantee-title">Qualité premium</div>
            <div className="faint">Tissus respirants et durables</div>
          </div>
        </div>
        <div className="guarantee">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.5 0 2-1 1.5-2s0-2 1.5-2H18a3 3 0 0 0 3-3c0-5-4-10-9-10z"></path>
            <circle cx="8" cy="10" r="1"></circle>
            <circle cx="12" cy="7.6" r="1"></circle>
            <circle cx="16" cy="10" r="1"></circle>
          </svg>
          <div>
            <div className="guarantee-title">Design exclusif</div>
            <div className="faint">Inspirés par Mayotte</div>
          </div>
        </div>
        <div className="guarantee">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="8.5"></circle>
            <path d="M12 7.4V12l3 1.8"></path>
          </svg>
          <div>
            <div className="guarantee-title">Édition limitée</div>
            <div className="faint">Chaque collection est unique</div>
          </div>
        </div>
        <div className="guarantee">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.2"></rect>
            <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7"></path>
          </svg>
          <div>
            <div className="guarantee-title">Paiement sécurisé</div>
            <div className="faint">Transactions 100% sécurisées</div>
          </div>
        </div>
      </div>

      <div className="panel products">
        <div className="panel-head">
          <h2>Nos maillots</h2>
          <Link href="/collection" className="cta small">
            Voir tout
          </Link>
        </div>
        {homeProducts.length === 0 && (
          <p className="faint">
            Aucun maillot pour l’instant. Ajoute-en depuis <Link href="/studio" style={{ textDecoration: "underline" }}>l&apos;espace produits</Link>.
          </p>
        )}
        <div className="product-grid">
          {homeProducts.map((product) => (
            <Link key={product.slug} href={`/produit/${product.slug}`} className="card">
              <div className="card-media">
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 1080px) 50vw, 20vw" />
                {product.badge && <span className="badge">{product.badge}</span>}
              </div>
              <div className="card-name">TORROW NAM – {product.name}</div>
              <div className="card-row">
                <span className="price">{BASE_PRICE} €</span>
                <span className="iconbtn" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 5h2.2l2.3 10.6h10l1.9-7.6H6.4"></path>
                    <circle cx="9.5" cy="19.3" r="1.3"></circle>
                    <circle cx="17.5" cy="19.3" r="1.3"></circle>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="panel collections">
        <div className="collections-copy">
          <h2
            className="collections-title"
            data-dark="Des collections qui racontent Mayotte."
            data-light="Des collections qui sentent bon l’été !"
          >
            Des collections qui sentent bon l’été !
          </h2>
          <p className="faint">Découvre l’histoire derrière chaque design.</p>
          <Link href="/collection" className="cta">
            <span>Explorer les collections</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h15M13 6l6 6-6 6"></path>
            </svg>
          </Link>
        </div>
        <div className="tiles">
          <Link href="/collection" className="tile">
            <Image src="/assets/jersey-details-green.webp" alt="Héritage" fill sizes="25vw" />
            <span className="tile-label">Héritage</span>
          </Link>
          <Link href="/collection" className="tile">
            <Image src="/assets/hero-06.jpg" alt="Nature" fill sizes="25vw" />
            <span className="tile-label">Nature</span>
          </Link>
          <Link href="/collection" className="tile">
            <Image src="/assets/hero-03.jpg" alt="Lagon" fill sizes="25vw" />
            <span className="tile-label">Lagon</span>
          </Link>
          <Link href="/collection" className="tile">
            <Image src="/assets/jersey-details-pink.webp" alt="Culture" fill sizes="25vw" />
            <span className="tile-label">Culture</span>
          </Link>
        </div>
      </div>

      <p className="faint" style={{ textAlign: "center", fontSize: 12.5, margin: "16px 0 0" }}>
        Maillot {BASE_PRICE} € · Flocage nom et numéro +{FLOQUAGE_PRICE} € · Livraison France métropolitaine 15 à 20
        jours · non disponible en DOM-TOM pour l’instant
      </p>
    </>
  );
}
