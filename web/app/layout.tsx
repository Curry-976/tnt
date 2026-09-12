import type { Metadata } from "next";
import Script from "next/script";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Torrow Nam Torrow",
    template: "%s · Torrow Nam Torrow",
  },
  description:
    "Maillots inspirés de Mayotte. Torrow Nam Torrow : une team, une identité.",
};

const THEME_INIT = `
try {
  var t = localStorage.getItem('tnt-theme');
  if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout, not pages/_document; this link is shared site-wide. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Caveat:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
