import nodemailer from "nodemailer";
import type { orders, orderItems } from "@/lib/db/schema";

type Order = typeof orders.$inferSelect;
type OrderItem = typeof orderItems.$inferSelect;

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

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const transport = getTransport();
  if (!transport) {
    throw new Error("Variables SMTP manquantes — impossible d'envoyer l'email.");
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await sendEmail({
    to,
    subject: "Réinitialise ton mot de passe — Torrow Nam Torrow",
    html: `
      <p>Tu as demandé à réinitialiser ton mot de passe sur Torrow Nam Torrow.</p>
      <p><a href="${resetUrl}">Clique ici pour choisir un nouveau mot de passe</a>.</p>
      <p>Ce lien expire dans 1 heure. Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>
    `,
  });
}

function orderItemsHtml(items: OrderItem[]) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">
            ${item.productName} — taille ${item.size}${item.floque ? `, flocage "${item.nom}" ${item.numero}` : ""} × ${item.qty}
          </td>
          <td style="padding:8px 0;text-align:right;white-space:nowrap;">
            ${((item.unitPriceCents * item.qty) / 100).toFixed(2)} €
          </td>
        </tr>
      `
    )
    .join("");
}

export async function sendOrderConfirmationEmail(order: Order, items: OrderItem[]) {
  await sendEmail({
    to: order.email,
    subject: `Confirmation de ta commande #${order.id} — Torrow Nam Torrow`,
    html: `
      <p>Merci pour ta commande sur Torrow Nam Torrow !</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${orderItemsHtml(items)}
        <tr>
          <td style="padding-top:12px;font-weight:bold;">Total</td>
          <td style="padding-top:12px;font-weight:bold;text-align:right;">${(order.totalCents / 100).toFixed(2)} €</td>
        </tr>
      </table>
      ${order.shippingAddress ? `<p>Adresse de livraison :<br>${order.shippingAddress.replace(/\n/g, "<br>")}</p>` : ""}
      <p>On te tient au courant dès que ta commande part chez le transporteur.</p>
    `,
  });
}

export async function sendAdminOrderNotificationEmail(order: Order, items: OrderItem[], adminEmails: string[]) {
  if (adminEmails.length === 0) return;

  await sendEmail({
    to: adminEmails.join(","),
    subject: `Nouvelle commande #${order.id} — ${(order.totalCents / 100).toFixed(2)} €`,
    html: `
      <p>Nouvelle commande payée par ${order.email}.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${orderItemsHtml(items)}
        <tr>
          <td style="padding-top:12px;font-weight:bold;">Total</td>
          <td style="padding-top:12px;font-weight:bold;text-align:right;">${(order.totalCents / 100).toFixed(2)} €</td>
        </tr>
      </table>
      ${order.shippingAddress ? `<p>Adresse de livraison :<br>${order.shippingAddress.replace(/\n/g, "<br>")}</p>` : ""}
    `,
  });
}
