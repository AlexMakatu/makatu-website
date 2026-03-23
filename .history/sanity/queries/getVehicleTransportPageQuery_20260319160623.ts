// getVehicleTransportPage.ts

import { groq } from "next-sanity";

export const getVehicleTransportPageQuery = groq`
*[_type == "vehicleTransportPage"][0]{

  title,

  heroHeading,
  heroText,
  heroBackground,
  heroImage,

  introBackground,
  introduction,
  introImage,

  vehicleTypesBackground,
  vehicleTypes[]{
    title,
    description,
    icon{
      asset->{url}
    }
  },

  customerTypesBackground,
  customerTypes[]{
    title,
    description,
    image
  },

  certificationsBackground,
  certifications[]{
    name,
    issuer,
    description,
    logo
  },

  seoBackground,
  seoContent,

  partnersBackground,
  partners[]{
    name,
    logo
  },

  ctaBackground,
  ctaTitle,
  ctaText
}
`;
