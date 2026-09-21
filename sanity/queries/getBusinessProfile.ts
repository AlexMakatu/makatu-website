import { groq } from "next-sanity";

export const businessProfileQuery = groq`
{
  "profile": *[_type == "businessProfile"][0]{
    title,
    tagline,
    intro,
    heroImage{asset->{url}},
    "whyChooseUs": whyChooseUs[] | order(displayOrder asc){
      _key, title, description, displayOrder
    },
    bbbeeLevel,
    bbbeeSummary,
    "bbbeeCertificateUrl": bbbeeCertificate.asset->url,
    insuranceAmount,
    insuranceSummary,
    "insuranceDocumentUrl": insuranceDocument.asset->url,
    dailyLocalCapacity,
    weeklyLongHaulCapacity,
    "fleet": fleet[] | order(displayOrder asc){
      _key, title, description, quantity, status, displayOrder,
      image{asset->{url}}
    },
    "leadTimes": leadTimes[] | order(displayOrder asc){
      _key, route, collection, delivery, displayOrder
    },
    "processSteps": processSteps[] | order(displayOrder asc){
      _key, title, description, displayOrder
    },
    operatingHours,
    paymentTerms,
    serviceArea,
    leadership[]->{
      _id,
      fullName,
      position,
      bio,
      leadershipProfile,
      yearsExperience,
      displayOrder,
      photo{asset->{url}},
      department->{title}
    },
    "clients": clients[] | order(displayOrder asc){
      _key, name, services, contactName, contactPhone,
      showContactPublicly, displayOrder,
      logo{asset->{url}}
    },
    contactHeading,
    contactText,
    contactEmail,
    contactPhone,
    website,
    publishedAt
  },
  "fallbackLeadership": *[
    _type == "organogramEmployee" &&
    active == true &&
    showOnPublicPage == true &&
    leadershipLevel in ["executive", "senior-management"]
  ] | order(displayOrder asc, fullName asc){
    _id,
    fullName,
    position,
    bio,
    leadershipProfile,
    yearsExperience,
    displayOrder,
    photo{asset->{url}},
    department->{title}
  }
}
`;
