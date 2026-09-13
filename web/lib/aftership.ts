// Wrapper around the AfterShip Tracking API v4.
// Docs: https://www.aftership.com/docs/tracking/v4

const API_BASE = "https://api.aftership.com/v4";

function headers() {
  const apiKey = process.env.AFTERSHIP_API_KEY;
  if (!apiKey) throw new Error("AFTERSHIP_API_KEY manquant.");
  return { "aftership-api-key": apiKey, "Content-Type": "application/json" };
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

type RawTracking = {
  tag?: string;
  checkpoints?: { message?: string; location?: string; checkpoint_time: string }[];
};

function mapTracking(tracking: RawTracking): TrackingStatus {
  return {
    tag: tracking.tag ?? "Pending",
    checkpoints: (tracking.checkpoints ?? []).map((c) => ({
      message: c.message ?? null,
      location: c.location ?? null,
      createdAt: c.checkpoint_time,
    })),
  };
}

export async function getTrackingStatus(
  trackingNumber: string,
  carrierSlug?: string
): Promise<TrackingStatus | null> {
  // With a known carrier, fetch that specific tracking directly. Without
  // one (carrier was auto-detected at registration), list trackings
  // filtered by tracking number instead, since the slug isn't known here.
  if (carrierSlug) {
    const response = await fetch(
      `${API_BASE}/trackings/${encodeURIComponent(carrierSlug)}/${encodeURIComponent(trackingNumber)}`,
      { headers: headers() }
    );
    if (!response.ok) return null;
    const body = await response.json();
    const tracking = body?.data?.tracking;
    return tracking ? mapTracking(tracking) : null;
  }

  const response = await fetch(
    `${API_BASE}/trackings?tracking_numbers=${encodeURIComponent(trackingNumber)}`,
    { headers: headers() }
  );
  if (!response.ok) return null;
  const body = await response.json();
  const tracking = body?.data?.trackings?.[0];
  return tracking ? mapTracking(tracking) : null;
}
