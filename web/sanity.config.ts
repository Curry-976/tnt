import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  name: "torrow_nam_torrow",
  title: "Torrow Nam Torrow — Maillots",
  projectId,
  dataset,
  schema,
  plugins: [structureTool()],
});
