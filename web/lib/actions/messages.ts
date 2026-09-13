"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";

export async function setMessageHandledAction(messageId: number, handled: boolean) {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    throw new Error("Non autorisé.");
  }

  await db.update(contactMessages).set({ handled }).where(eq(contactMessages.id, messageId));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
