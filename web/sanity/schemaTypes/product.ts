import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Maillot",
  type: "document",
  fields: [
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
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Domicile", value: "home" },
          { title: "Extérieur", value: "away" },
          { title: "Gardien", value: "keeper" },
        ],
        layout: "radio",
      },
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
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge (optionnel)",
      type: "string",
      description: "Ex. « Nouveau », « Édition limitée » — laisser vide pour n'afficher aucun badge.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      description: "Les maillots s'affichent du plus petit au plus grand nombre.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "image" },
  },
});
