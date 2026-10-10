import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// READ CLIENT (server only).
// Uses the Viewer token so the site keeps working once the dataset is Private.
// If SANITY_API_READ_TOKEN is not set it falls back to anonymous reads
// (works only while the dataset is still Public).
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});

// 🔥 WRITE CLIENT (use your EXISTING env var)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN, // 👈 use your current name
  useCdn: false,
});
