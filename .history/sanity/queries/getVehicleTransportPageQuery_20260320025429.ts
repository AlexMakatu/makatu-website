import { groq } from "next-sanity";

const getVehicleTransportPageQuery = groq`
  *[_type == "vehicleTransportPage"][0]{
    heroHeading,
    heroText,
    heroImage,
    heroBackground,

    introduction,
    introImage,
    introBackground,

    vehicleTypes,
    vehicleTypesBackground,

    customerTypes,
    customerTypesBackground,

    certifications,
    certificationsBackground,

    seoContent,
    seoBackground,

    partners,
    partnersBackground,

    ctaTitle,
    ctaText,
    ctaBackground
  }
`;

export default getVehicleTransportPageQuery;
