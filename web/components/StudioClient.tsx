"use client";

// Imported directly from the client-component subpath (not the "next-sanity/studio"
// barrel) so the whole Studio bundle stays out of the server/RSC module graph —
// pulling it in server-side breaks the build (swr's "react-server" export has
// no default export, which Sanity's internals expect).
import { NextStudio } from "next-sanity/studio/client-component";
import config from "@/sanity.config";

export function StudioClient() {
  return <NextStudio config={config} />;
}
