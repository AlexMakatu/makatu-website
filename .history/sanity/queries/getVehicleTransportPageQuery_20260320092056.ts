import { groq } from "next-sanity";

const getVehicleTransportPageQuery = groq`
  *[_type == "vehicleTransportPage"][0]{
    heroHeading,
    heroText,
    heroImage{
      asset->{url},
      alt
    },
    heroBackground,

    introduction,
    introImage{
      asset->{url},
      alt
    },
    introBackground,

    vehicleTypes[]{
      title,
      description,
      icon{
        asset->{url},
        alt
      }
    },
    vehicleTypesBackground,

    customerTypes[]{
      title,
      description,
      image{
        asset->{url},
        alt
      }
    },
    customerTypesBackground,

    certifications[]{
      name,
      issuer,
      description,
      status,
      logo{
        asset->{url},
        alt
      }
    },
    certificationsBackground,

    seoContent,
    seoBackground,

    partners[]{
      name,
      logo{
        asset->{url},
        alt
      }
    },
    partnersBackground,

    ctaTitle,
    ctaText,
    ctaBackground
  }
`;

export default getVehicleTransportPageQuery;
