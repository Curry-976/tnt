import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

// Products are reordered by dragging them in this list (writes to the
// hidden orderRank field directly) instead of typing a number into a
// field and hoping it beats everyone else's default — that's what kept
// silently failing to change the on-site order.
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Contenu")
    .items([
      orderableDocumentListDeskItem({
        type: "product",
        title: "Maillots",
        S,
        context,
      }),
    ]);
