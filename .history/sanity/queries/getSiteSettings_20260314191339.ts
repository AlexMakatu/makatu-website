import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
*[_type == "siteSettings"][0]{
  siteTitle,
  logo{
    asset->{url}
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
  },
  socialLinks[]{
    platform,
    url
  }
}
`;
