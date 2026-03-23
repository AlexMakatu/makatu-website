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

      // SALES
      S.listItem()
        .title("Sales / Leads")
        .child(
          S.list()
            .title("Quote Requests")
            .items([
              S.documentTypeListItem("quoteRequest").title("Quote Requests"),
            ]),
        ),
    ]);
