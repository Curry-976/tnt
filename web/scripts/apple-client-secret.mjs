// Génère AUTH_APPLE_SECRET pour « Se connecter avec Apple » : un JWT signé
// (ES256) avec la clé .p8 téléchargée sur developer.apple.com > Keys.
// Apple refuse un secret valable plus de 6 mois : relance ce script avant
// l'expiration (la date est affichée) et mets à jour la variable sur Netlify.
//
// Usage (Node.js 18+, aucune dépendance) :
//   node apple-client-secret.mjs <fichier.p8> <TEAM_ID> <KEY_ID> <SERVICES_ID>
import { readFileSync } from "node:fs";
import { createPrivateKey, sign } from "node:crypto";

const [keyFile, teamId, keyId, clientId] = process.argv.slice(2);
if (!keyFile || !teamId || !keyId || !clientId) {
  console.error("Usage : node apple-client-secret.mjs <fichier.p8> <TEAM_ID> <KEY_ID> <SERVICES_ID>");
  process.exit(1);
}

const SIX_MONTHS = 180 * 24 * 60 * 60; // un peu sous la limite d'Apple (15 777 000 s)
const now = Math.floor(Date.now() / 1000);
const b64url = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

const header = b64url({ alg: "ES256", kid: keyId });
const payload = b64url({
  iss: teamId,
  iat: now,
  exp: now + SIX_MONTHS,
  aud: "https://appleid.apple.com",
  sub: clientId,
});
const key = createPrivateKey(readFileSync(keyFile));
// JWT attend la signature ECDSA brute (r||s), pas le format DER par défaut.
const signature = sign("sha256", Buffer.from(`${header}.${payload}`), { key, dsaEncoding: "ieee-p1363" });

console.log(`AUTH_APPLE_ID=${clientId}`);
console.log(`AUTH_APPLE_SECRET=${header}.${payload}.${signature.toString("base64url")}`);
console.error(`\nExpire le ${new Date((now + SIX_MONTHS) * 1000).toLocaleDateString("fr-FR")} : régénère-le avant cette date.`);
