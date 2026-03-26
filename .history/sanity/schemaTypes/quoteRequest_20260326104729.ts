import { defineType, defineField } from "sanity";

export default defineType({
  name: "quoteRequest",
  title: "Quote Request",
  type: "document",
  fields: [
    // 👤 CUSTOMER INFO
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "customerType",
      title: "Customer Type",
      type: "string",
      options: {
        list: [
          { title: "Private", value: "private" },
          { title: "Dealership", value: "dealership" },
          { title: "Fleet", value: "fleet" },
        ],
      },
      initialValue: "private",
    }),

    // 🚚 ROUTE
    defineField({
      name: "fromCity",
      title: "From City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "toCity",
      title: "To City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "transportType",
      title: "Transport Type",
      type: "string",
      options: {
        list: [
          { title: "Door to Door", value: "doorToDoor" },
          { title: "Dealer to Dealer", value: "dealerToDealer" },
          { title: "Dealer to Private", value: "dealerToPrivate" },
          { title: "Private to Dealer", value: "privateToDealer" },
        ],
      },
      initialValue: "doorToDoor",
    }),

    // 🚗 VEHICLES (MULTI-VEHICLE ARRAY)
    defineField({
      name: "vehicles",
      title: "Vehicles",
      type: "array",
      of: [
        {
          type: "object",
          name: "vehicle",
          fields: [
            defineField({
              name: "vehicleType",
              title: "Vehicle Type",
              type: "string",
              options: {
                list: [
                  { title: "Hatchback", value: "hatchback" },
                  { title: "Sedan", value: "sedan" },
                  { title: "SUV", value: "suv" },
                  { title: "Bakkie", value: "bakkie" },
                  { title: "Van", value: "van" },
                  { title: "Luxury / Exotic", value: "luxury" },
                  { title: "Other", value: "other" },
                ],
              },
            }),

            defineField({
              name: "vehicleMake",
              title: "Vehicle Make",
              type: "string",
            }),

            defineField({
              name: "vehicleModel",
              title: "Vehicle Model",
              type: "string",
            }),

            defineField({
              name: "vehicleYear",
              title: "Vehicle Year",
              type: "string",
            }),

            defineField({
              name: "vehicleCondition",
              title: "Vehicle Condition",
              type: "string",
              options: {
                list: [
                  { title: "Runner", value: "runner" },
                  { title: "Non-Runner", value: "nonRunner" },
                  { title: "Requires Forklift", value: "forklift" },
                ],
              },
            }),
          ],
        },
      ],
    }),

    // 📅 COLLECTION
    defineField({
      name: "collectionDateType",
      title: "Collection Date Type",
      type: "string",
      options: {
        list: [
          { title: "Flexible", value: "flexible" },
          { title: "ASAP", value: "asap" },
          { title: "Specific Date", value: "specificDate" },
        ],
      },
      initialValue: "flexible",
    }),

    defineField({
      name: "collectionDate",
      title: "Collection Date",
      type: "date",
    }),

    // 💰 PRICING
    defineField({
      name: "quotedPriceType",
      title: "Quoted Price Type",
      type: "string",
      options: {
        list: [
          { title: "Fixed", value: "fixed" },
          { title: "Starting From", value: "startingFrom" },
          { title: "Negotiable", value: "negotiable" },
          { title: "Quote Required", value: "quoteRequired" },
        ],
      },
    }),

    defineField({
      name: "quotedPrice",
      title: "Quoted Price",
      type: "number",
    }),

    defineField({
      name: "priceToBeat",
      title: "Price To Beat",
      type: "number",
    }),

    // 📝 NOTES
    defineField({
      name: "notes",
      title: "Additional Notes",
      type: "text",
    }),

    // 📊 STATUS
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Quoted", value: "quoted" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
    }),

    // 🕒 SUBMISSION TIME
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
