import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// ✅ READ CLIENT (unchanged)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// 🔥 WRITE CLIENT (use your EXISTING env var)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN, // 👈 use your current name
  useCdn: false,
});
