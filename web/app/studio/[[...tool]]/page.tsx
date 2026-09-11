import type { Metadata, Viewport } from "next";
import { StudioClient } from "@/components/StudioClient";

// Hardcoded rather than re-exported from "next-sanity/studio": importing
// anything from that barrel file (even just these two constants) pulls the
// whole Studio bundle into the server module graph and breaks the build —
// see components/StudioClient.tsx.
export const metadata: Metadata = {
  referrer: "same-origin",
  robots: "noindex",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const dynamic = "force-static";

export default function StudioPage() {
  return <StudioClient />;
}
