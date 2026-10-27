import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const product = defineType({
  name: "product",
  title: "Maillot",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "visible",
      title: "Visible sur le site",
      type: "boolean",
      description: "Décoche pour retirer ce maillot du site sans le supprimer (ex. pour un brouillon ou un test).",
      initialValue: true,
    }),
    defineField({
      name: "outOfStock",
      title: "Rupture de stock",
      type: "boolean",
      description: "Coche pour garder la fiche visible mais désactiver l'achat (bouton « Rupture de stock »).",
      initialValue: false,
    }),
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      description: "Ex. « Domicile / Noir »",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "name", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "season",
      title: "Saison",
      type: "string",
      description: "Collection à laquelle appartient ce maillot.",
      options: {
        list: [
          { title: "Été", value: "ete" },
          { title: "Hiver (à venir)", value: "hiver" },
        ],
        layout: "radio",
      },
      initialValue: "ete",
    }),
    defineField({
      name: "image",
      title: "Photo (thème clair)",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageDark",
      title: "Photo (thème sombre)",
      type: "image",
      options: { hotspot: true },
      description: "Optionnel — laisser vide pour réutiliser la photo du thème clair dans les deux thèmes.",
    }),
    defineField({
      name: "badge",
      title: "Badge (optionnel)",
      type: "string",
      description: "Ex. « Nouveau », « Édition limitée » — laisser vide pour n'afficher aucun badge.",
    }),
    defineField({
      name: "badgeColor",
      title: "Couleur du badge",
      type: "color",
      description: "La couleur du bandeau — choisis-la pour l'assortir au coloris de ce maillot. Laisse vide pour le doré par défaut.",
      hidden: ({ document }) => !document?.badge,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    orderRankField({ type: "product" }),
  ],
  preview: {
    select: { title: "name", subtitle: "season", media: "image", visible: "visible", outOfStock: "outOfStock" },
    prepare({ title, subtitle, media, visible, outOfStock }) {
      const tags = [visible === false && "Masqué", outOfStock && "Rupture de stock"].filter(Boolean);
      return {
        title,
        subtitle: tags.length ? `${tags.join(" · ")} · ${subtitle}` : subtitle,
        media,
      };
    },
  },
});
