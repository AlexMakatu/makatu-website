import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
*[_type == "siteSettings"][0]{
  siteTitle,
  siteDescription,

  logo{
    asset->{url}
  },

  logoIcon{
    asset->{url}
  },

  favicon{
    asset->{url}
  },

  navigation[]{
    label,
    href,
    highlight,
    external
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
