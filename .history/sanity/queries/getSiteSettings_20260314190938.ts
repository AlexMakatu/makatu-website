import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
*[_type == "siteSettings"][0]{
  siteTitle,
  footerDescription,
  logo{
    asset->{url}
  },
  footerColumns[]{
    title,
    links[]{
      label,
      href
    }
  },
  socialLinks[]{
    platform,
    url
  },
  footerText
}
`;
