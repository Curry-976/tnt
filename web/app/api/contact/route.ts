import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

type ContactBody = {
  name: string;
  email: string;
  message: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ContactBody;
  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !email.includes("@") || !message) {
    return NextResponse.json({ error: "Merci de remplir tous les champs correctement." }, { status: 400 });
  }

  await db.insert(contactMessages).values({ name, email, message });

  return NextResponse.json({ ok: true });
}
