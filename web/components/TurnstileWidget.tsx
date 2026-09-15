"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
    };
  }
}

// Renders nothing when Turnstile isn't configured (no site key) — forms fall
// back to the honeypot + timing + rate-limit checks only.
export function TurnstileWidget({ onToken }: { onToken: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    if (window.turnstile) {
      setScriptReady(true);
      return;
    }
    // The api.js script may have already loaded on a previous page in this
    // session — poll briefly instead of relying only on Script's onLoad.
    const interval = setInterval(() => {
      if (window.turnstile) {
        setScriptReady(true);
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || renderedRef.current || !window.turnstile) return;
    renderedRef.current = true;
    window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(null),
    });
  }, [scriptReady, onToken]);

  if (!TURNSTILE_SITE_KEY) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div ref={containerRef} style={{ margin: "12px 0" }} />
    </>
  );
}
