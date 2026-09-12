// Minimal wrapper around the AfterShip Tracking API.
// Docs: https://www.aftership.com/docs/tracking/quickstart

const API_BASE = "https://api.aftership.com/tracking/2025-07";

function headers() {
  const apiKey = process.env.AFTERSHIP_API_KEY;
  if (!apiKey) throw new Error("AFTERSHIP_API_KEY manquant.");
  return { "as-api-key": apiKey, "Content-Type": "application/json" };
}

// Registers a shipment so AfterShip starts polling the carrier for updates.
// carrierSlug is optional — omit it to let AfterShip auto-detect the carrier
// from the tracking number's format (works for most major carriers).
export async function registerTracking(trackingNumber: string, carrierSlug?: string) {
  const response = await fetch(`${API_BASE}/trackings`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      tracking: {
        tracking_number: trackingNumber,
        ...(carrierSlug ? { slug: carrierSlug } : {}),
      },
    }),
  });

  const body = await response.json().catch(() => null);
  // 4003 = tracking already exists — not an error, it's already registered.
  if (!response.ok && body?.meta?.code !== 4003) {
    throw new Error(`AfterShip a refusé le suivi : ${response.status} ${JSON.stringify(body)}`);
  }
}

export type TrackingCheckpoint = {
  message: string | null;
  location: string | null;
  createdAt: string;
};

export type TrackingStatus = {
  tag: string; // Pending | InfoReceived | InTransit | OutForDelivery | Delivered | Exception | AttemptFail
  checkpoints: TrackingCheckpoint[];
};

export async function getTrackingStatus(
  trackingNumber: string,
  carrierSlug?: string
): Promise<TrackingStatus | null> {
  const query = carrierSlug ? `?slug=${encodeURIComponent(carrierSlug)}` : "";
  const response = await fetch(
    `${API_BASE}/trackings/${encodeURIComponent(trackingNumber)}${query}`,
    { headers: headers() }
  );
  if (!response.ok) return null;

  const body = await response.json();
  const tracking = body?.data?.tracking;
  if (!tracking) return null;

  return {
    tag: tracking.tag ?? "Pending",
    checkpoints: (tracking.checkpoints ?? []).map((c: { message?: string; location?: string; created_at: string }) => ({
      message: c.message ?? null,
      location: c.location ?? null,
      createdAt: c.created_at,
    })),
  };
}
