import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
*[_type == "siteSettings"][0]{
  siteTitle,
  logo,
  footerColumns[]{
    title,
    links[]{
      label,
      href
    }
  },
  footerText,
  socialLinks[]{
    platform,
    url
  }
}
`;
