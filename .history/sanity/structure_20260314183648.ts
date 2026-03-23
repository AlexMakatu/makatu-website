import { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Makatu CMS")
    .items([
      /*
      GLOBAL
      */

      S.listItem()
        .title("Homepage")
        .child(S.documentTypeList("homepage").title("Homepage")),

      S.listItem()
        .title("Site Settings")
        .child(S.documentTypeList("siteSettings").title("Site Settings")),

      S.divider(),

      /*
      WEBSITE CONTENT
      */

      S.listItem()
        .title("Website Content")
        .child(
          S.list()
            .title("Website Content")
            .items([
              S.documentTypeListItem("service").title("Services"),
              S.documentTypeListItem("processSection").title(
                "Process Sections",
              ),
              S.documentTypeListItem("faq").title("FAQs"),
              S.documentTypeListItem("contactPage").title("Contact Page"),
            ]),
        ),

      /*
      TRANSPORT SYSTEM
      */

      S.listItem()
        .title("Transport System")
        .child(
          S.list()
            .title("Transport System")
            .items([
              S.documentTypeListItem("route").title("Vehicle Transport Routes"),
              S.documentTypeListItem("city").title("Cities"),
              S.documentTypeListItem("vehicleType").title("Vehicle Types"),
              S.documentTypeListItem("routeRate").title("Route Rates"),
            ]),
        ),

      /*
      MARKETING
      */

      S.listItem()
        .title("Marketing")
        .child(
          S.list()
            .title("Marketing")
            .items([
              S.documentTypeListItem("blogPost").title("Blog Posts"),
              S.documentTypeListItem("author").title("Authors"),
              S.documentTypeListItem("category").title("Categories"),
            ]),
        ),

      /*
      SALES
      */

      S.listItem()
        .title("Sales / Leads")
        .child(S.documentTypeList("quoteRequest").title("Quote Requests")),
    ]);
