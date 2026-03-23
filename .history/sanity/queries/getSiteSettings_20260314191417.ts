import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
*[_type == "siteSettings"][0]{
  siteTitle,
  logo{
    asset->{url}
  },
  socialLinks[]{
    platform,
    url
  },
  footer{
    description,
    columns[]{
      title,
      links[]{
        label,
        href
      }
    },
    copyright
  }
}
`;
