import type { Metadata } from "next";
import { Archivo, Caveat } from "next/font/google";
import Script from "next/script";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { SITE_URL } from "@/lib/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FlyToCartAnimation } from "@/components/FlyToCartAnimation";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const SITE_NAME = "Torrow Nam Torrow";
const HOME_TITLE = `${SITE_NAME} · Maillots streetwear inspirés de Mayotte`;
const SITE_DESCRIPTION =
  "Maillots streetwear inspirés de Mayotte, personnalisables nom et numéro, livraison en France métropolitaine.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/assets/hero-06.jpg", width: 1376, height: 768, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/assets/hero-06.jpg"],
  },
};

const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-archivo",
});

// Only weight 700 is ever used (see .hero-title in globals.css) — the old
// <link> setup loaded 500 too, for nothing.
const caveat = Caveat({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  variable: "--font-caveat",
});

const THEME_INIT = `
try {
  var t = localStorage.getItem('tnt-theme');
  if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${archivo.variable} ${caveat.variable}`}>
      <body>
        <Script id="tnt-theme-init" strategy="beforeInteractive">
          {THEME_INIT}
        </Script>
        <CartProvider>
          <FavoritesProvider>
            <div id="top" className="shell">
              <Nav />
              {children}
              <Footer />
            </div>
            <FlyToCartAnimation />
            <CookieBanner />
            <GoogleAnalytics />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
