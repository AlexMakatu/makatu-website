import { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Makatu CMS")
    .items([
      // WEBSITE CONTENT
      S.listItem()
        .title("Website Content")
        .child(
          S.list()
            .title("Website Content")
            .items([
              S.documentTypeListItem("homepage").title("Homepage"),
              S.documentTypeListItem("service").title("Services"),
              S.documentTypeListItem("contactPage").title("Contact Page"),
            ]),
        ),

      // MARKETING
      S.listItem()
        .title("Marketing")
        .child(
          S.list()
            .title("Marketing")
            .items([S.documentTypeListItem("blogPost").title("Blog Posts")]),
        ),

      // TRANSPORT SYSTEM
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

      // SALES / LEADS
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
