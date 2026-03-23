import { defineType, defineField } from "sanity";

export default defineType({
  name: "quoteRequest",
  title: "Quote Request",
  type: "document",
  fields: [
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
          { title: "Depot to Depot", value: "depot" },
          { title: "Door to Door", value: "doorToDoor" },
          { title: "Dealer to Dealer", value: "dealerToDealer" },
        ],
      },
      initialValue: "doorToDoor",
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
      name: "vehicleCondition",
      title: "Vehicle Condition",
      type: "string",
      options: {
        list: [
          { title: "Runner", value: "runner" },
          { title: "Non-Runner", value: "nonRunner" },
        ],
      },
    }),

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
      name: "notes",
      title: "Additional Notes",
      type: "text",
    }),

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

    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      fromCity: "fromCity",
      toCity: "toCity",
      status: "status",
    },
    prepare(selection) {
      const { title, fromCity, toCity, status } = selection;

      return {
        title: title || "Unnamed Quote Request",
        subtitle: `${fromCity || "Unknown"} → ${toCity || "Unknown"} • ${status || "new"}`,
      };
    },
  },
});
