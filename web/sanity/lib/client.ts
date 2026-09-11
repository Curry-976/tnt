import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, isSanityConfigured } from "../env";

// Built lazily — constructing the client eagerly throws when projectId is
// empty, which would break every page that imports this module before
// Sanity is configured (same pattern as lib/db and lib/stripe).
let cached: SanityClient | null = null;

export function getClient(): SanityClient {
  if (!isSanityConfigured) {
    throw new Error(
      "Sanity is not configured. Add NEXT_PUBLIC_SANITY_PROJECT_ID to .env.local (see .env.example)."
    );
  }
  if (!cached) {
    cached = createClient({
      projectId,
      dataset,
      apiVersion,
      // Cached, fast reads for the storefront. Product edits in the Studio
      // can take up to a minute to show up on the site as a result.
      useCdn: true,
    });
  }
  return cached;
}
