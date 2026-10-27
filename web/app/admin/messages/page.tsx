import type { Metadata } from "next";
import { getAllMessages } from "@/lib/admin-data";
import { MessagesInbox } from "@/components/admin/MessagesInbox";

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getAllMessages();

  return (
    <>
      <div className="admin-topbar">
        <h1>Messages</h1>
      </div>
      <div className="admin-content" style={{ display: "flex", flexDirection: "column" }}>
        <MessagesInbox
          messages={messages.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            message: m.message,
            handled: m.handled,
            createdAt: m.createdAt.toISOString(),
          }))}
        />
      </div>
    </>
  );
}
