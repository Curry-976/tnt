"use client";

export function PrintButton({ label = "Télécharger / Imprimer" }: { label?: string }) {
  return (
    <button type="button" className="cta no-print" onClick={() => window.print()}>
      <span>{label}</span>
    </button>
  );
}
