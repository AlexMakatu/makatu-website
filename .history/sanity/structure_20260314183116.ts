import { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Makatu CMS")
    .items([
      /*
       ─────────────────────────
       GLOBAL SETTINGS
       ─────────────────────────
      */

      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),

      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),

      S.divider(),

      /*
       ─────────────────────────
       WEBSITE CONTENT
       ─────────────────────────
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
              S.documentTypeListItem("contactPage").title("Contact Page"),
              S.documentTypeListItem("faq").title("FAQs"),
            ]),
        ),

      /*
       ─────────────────────────
       MARKETING
       ─────────────────────────
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
       ─────────────────────────
       TRANSPORT SYSTEM
       ─────────────────────────
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
       ─────────────────────────
       SALES / LEADS
       ─────────────────────────
      */

      S.listItem()
        .title("Sales / Leads")
        .child(
          S.list()
            .title("Sales / Leads")
            .items([
              S.documentTypeListItem("quoteRequest").title("Quote Requests"),
            ]),
        ),
    ]);
