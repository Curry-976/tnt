import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { isRateLimited, ipFromForwardedFor } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

type ContactBody = {
  name: string;
  email: string;
  message: string;
  website?: string; // honeypot — real visitors never fill this
  renderedAt?: number; // ms timestamp from when the form mounted
  turnstileToken?: string | null;
};

export async function POST(request: Request) {
  const ip = ipFromForwardedFor(request.headers.get("x-forwarded-for"));

  if (isRateLimited(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ error: "Trop de messages envoyés. Réessaie un peu plus tard." }, { status: 429 });
  }

  const body = (await request.json()) as ContactBody;
  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  // Honeypot filled in -> a bot. Timing too fast for a human to have read
  // and filled three fields -> also a bot. Both fail silently as if the
  // message sent, so the bot doesn't learn its submission was rejected.
  const isHoneypotFilled = Boolean(body.website);
  const isTooFast = typeof body.renderedAt === "number" && Date.now() - body.renderedAt < 2000;
  if (isHoneypotFilled || isTooFast) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !email.includes("@") || !message) {
    return NextResponse.json({ error: "Merci de remplir tous les champs correctement." }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstileToken(body.turnstileToken ?? null, ip);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Vérification anti-robot échouée, réessaie." }, { status: 400 });
  }

  await db.insert(contactMessages).values({ name, email, message });

  return NextResponse.json({ ok: true });
}
