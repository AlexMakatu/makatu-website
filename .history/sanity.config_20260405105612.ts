import { defineConfig } from "sanity";

import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "studio",
  title: "Makatu",
  basePath: "/studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [visionTool()],

  schema: {
    types: schemaTypes,
  },
});
