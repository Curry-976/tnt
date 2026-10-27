import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import { getAllMessages } from "@/lib/admin-data";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = { title: { template: "%s — Administration", default: "Administration" } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) redirect("/");

  const messages = await getAllMessages();
  const hasUnhandled = messages.some((m) => !m.handled);
  const name = session!.user!.name ?? session!.user!.email ?? "Admin";
  const initials = name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";

  return (
    <div className="admin-shell">
      <AdminSidebar name={name} initials={initials} hasUnhandled={hasUnhandled} />
      <div className="admin-main">{children}</div>
    </div>
  );
}
