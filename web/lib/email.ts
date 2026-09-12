import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) {
    throw new Error("RESEND_API_KEY manquant — impossible d'envoyer l'email de réinitialisation.");
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Torrow Nam Torrow <onboarding@resend.dev>",
    to,
    subject: "Réinitialise ton mot de passe — Torrow Nam Torrow",
    html: `
      <p>Tu as demandé à réinitialiser ton mot de passe sur Torrow Nam Torrow.</p>
      <p><a href="${resetUrl}">Clique ici pour choisir un nouveau mot de passe</a>.</p>
      <p>Ce lien expire dans 1 heure. Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>
    `,
  });
}
