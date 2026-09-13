"use client";

import { useState, useTransition } from "react";
import { setMessageHandledAction } from "@/lib/actions/messages";

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  handled: boolean;
  createdAt: string;
};

export function MessagesInbox({ messages }: { messages: Message[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(messages[0]?.id ?? null);
  const [pending, startTransition] = useTransition();
  const selected = messages.find((m) => m.id === selectedId) ?? null;

  return (
    <div className="admin-messages-layout" style={{ flex: 1 }}>
      <div className="admin-panel" style={{ padding: 0, overflow: "hidden" }}>
        <div className="admin-messages-list">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`admin-message-row${m.id === selectedId ? " is-selected" : ""}`}
              onClick={() => setSelectedId(m.id)}
            >
              <div className="admin-message-row-head">
                <span className="admin-message-name">{m.name}</span>
                {!m.handled && <span className="admin-unhandled-dot" />}
              </div>
              <div className="admin-message-snippet">{m.message}</div>
              <div className="admin-message-date">{new Date(m.createdAt).toLocaleDateString("fr-FR")}</div>
            </div>
          ))}
          {messages.length === 0 && <p className="admin-detail-empty">Aucun message pour l’instant.</p>}
        </div>
      </div>

      <div className="admin-panel">
        {!selected && <div className="admin-detail-empty">Sélectionne un message pour le lire.</div>}
        {selected && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: "#6d7689" }}>
                  {selected.name} · {selected.email} · {new Date(selected.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <button
                type="button"
                className={`admin-handled-btn${selected.handled ? " is-handled" : ""}`}
                disabled={pending}
                onClick={() =>
                  startTransition(() => {
                    setMessageHandledAction(selected.id, !selected.handled);
                  })
                }
              >
                {selected.handled ? "Traité" : "Marquer comme traité"}
              </button>
            </div>
            <div style={{ fontSize: 14.5, lineHeight: 1.7, color: "#2c3653", maxWidth: 560, whiteSpace: "pre-wrap" }}>
              {selected.message}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
