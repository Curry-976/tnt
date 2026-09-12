import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { AccountSettingsForms } from "@/components/AccountSettingsForms";

export const metadata: Metadata = { title: "Modifier mes infos" };
export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  const session = await auth();
  if (!session?.user) redirect("/compte");

  const [user] = await db.select().from(users).where(eq(users.id, Number(session.user.id))).limit(1);
  if (!user) redirect("/compte");

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Compte</div>
        <h1 className="page-title">Modifier mes infos</h1>
      </div>
      <AccountSettingsForms name={user.name ?? ""} email={user.email} hasPassword={!!user.passwordHash} />
    </>
  );
}
