import { groq } from "next-sanity";

const getVehicleTransportPageQuery = groq`
  *[_type == "vehicleTransportPage"][0]{
    heroHeading,
    heroText,
    heroImage{
      asset,
      alt
    },
    heroBackground,

    introduction,
    introImage{
      asset,
      alt
    },
    introBackground,

    vehicleTypes[]{
      title,
      description,
      icon{
        asset,
        alt
      }
    },
    vehicleTypesBackground,

    customerTypes[]{
      title,
      description,
      image{
        asset,
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
        asset,
        alt
      }
    },
    certificationsBackground,

    seoContent,
    seoBackground,

    partners[]{
      name,
      logo{
        asset,
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
