import createImageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: unknown) => {
  if (!source) return null;

  // ✅ Handle seoImage (nested asset.asset)
  if (
    typeof source === "object" &&
    source !== null &&
    "asset" in source &&
    typeof source.asset === "object" &&
    source.asset !== null &&
    "asset" in source.asset &&
    typeof source.asset.asset === "object" &&
    source.asset.asset !== null &&
    "_ref" in source.asset.asset
  ) {
    return builder.image(source.asset.asset as SanityImageSource);
  }

  // ✅ Handle normal image
  if (
    typeof source === "object" &&
    source !== null &&
    "asset" in source &&
    typeof source.asset === "object" &&
    source.asset !== null &&
    "_ref" in source.asset
  ) {
    return builder.image(source as SanityImageSource);
  }

  return null;
};
