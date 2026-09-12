import nodemailer from "nodemailer";

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transport = getTransport();
  if (!transport) {
    throw new Error("Variables SMTP manquantes — impossible d'envoyer l'email de réinitialisation.");
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    subject: "Réinitialise ton mot de passe — Torrow Nam Torrow",
    html: `
      <p>Tu as demandé à réinitialiser ton mot de passe sur Torrow Nam Torrow.</p>
      <p><a href="${resetUrl}">Clique ici pour choisir un nouveau mot de passe</a>.</p>
      <p>Ce lien expire dans 1 heure. Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>
    `,
  });
}
