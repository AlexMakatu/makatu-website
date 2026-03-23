import { groq } from "next-sanity";

export const getVehicleTransportPageQuery = groq`
*[_type == "vehicleTransportPage"][0]{

  title,

  heroHeading,
  heroText,
  heroBackground,
  heroImage{
    asset->{url},
    alt
  },

  introBackground,
  introduction,
  introImage{
    asset->{url},
    alt
  },

  vehicleTypesBackground,
  vehicleTypes[]{
    title,
    description,
    image{
      asset->{url},
      alt
    }
  },

  customerTypesBackground,
  customerTypes[]{
    title,
    description,
    image{
      asset->{url},
      alt
    }
  },

  certificationsBackground,
  certifications[]{
    name,
    issuer,
    description,
    logo{
      asset->{url},
      alt
    }
  },

  seoBackground,
  seoContent,

  partnersBackground,
  partners[]{
    name,
    logo{
      asset->{url},
      alt
    }
  },

  ctaBackground,
  ctaTitle,
  ctaText
}
`;
