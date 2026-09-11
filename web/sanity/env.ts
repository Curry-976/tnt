export const apiVersion = "2026-01-01";

// Falls back to empty values instead of throwing so the app still builds and
// every page that doesn't touch Sanity works before these are configured
// (same pattern as lib/db and lib/stripe). The Studio and the catalog
// queries handle an empty projectId by showing an empty/setup state instead
// of a hard crash.
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const isSanityConfigured = Boolean(projectId);
