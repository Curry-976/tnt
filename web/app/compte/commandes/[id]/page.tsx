import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { getTrackingStatus } from "@/lib/aftership";

export const metadata: Metadata = { title: "Suivi de commande" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  Pending: "En attente de prise en charge",
  InfoReceived: "Information reçue par le transporteur",
  InTransit: "En transit",
  OutForDelivery: "En cours de livraison",
  AttemptFail: "Tentative de livraison échouée",
  Delivered: "Livré",
  Exception: "Incident de livraison",
  Expired: "Suivi expiré",
};

export default async function SuiviCommandePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/compte");

  const [order] = await db.select().from(orders).where(eq(orders.id, Number(id))).limit(1);
  if (!order || order.userId !== Number(session.user.id)) notFound();
  if (!order.trackingNumber) notFound();

  const tracking = await getTrackingStatus(order.trackingNumber, order.trackingCarrierSlug ?? undefined);

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Compte</div>
        <h1 className="page-title">Suivi — commande #{order.id}</h1>
      </div>

      <div className="panel">
        <p className="faint" style={{ marginTop: 0 }}>Numéro de suivi : {order.trackingNumber}</p>

        {!tracking ? (
          <p>Le suivi n&apos;est pas encore disponible pour ce colis. Réessaie un peu plus tard.</p>
        ) : (
          <>
            <p style={{ fontWeight: 600, fontSize: 18 }}>
              {STATUS_LABELS[tracking.tag] ?? tracking.tag}
            </p>

            {tracking.checkpoints.length > 0 && (
              <div className="cart-list" style={{ marginTop: 24 }}>
                {tracking.checkpoints
                  .slice()
                  .reverse()
                  .map((checkpoint, i) => (
                    <div key={i} className="panel cart-row" style={{ gridTemplateColumns: "1fr auto" }}>
                      <div>
                        <div className="cart-meta-name">{checkpoint.message ?? "Mise à jour"}</div>
                        {checkpoint.location && (
                          <div className="cart-meta-detail">{checkpoint.location}</div>
                        )}
                      </div>
                      <div className="faint">
                        {new Date(checkpoint.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
