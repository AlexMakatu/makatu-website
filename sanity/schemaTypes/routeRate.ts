import { defineType, defineField } from "sanity";

export default defineType({
  name: "routeRate",
  title: "Route Rate",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      description: "Example: Johannesburg to Cape Town - Sedan",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "fromCity",
      title: "From City",
      type: "reference",
      to: [{ type: "city" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "toCity",
      title: "To City",
      type: "reference",
      to: [{ type: "city" }],
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "priceType",
      title: "Price Type",
      type: "string",
      options: {
        list: [
          { title: "Fixed Price", value: "fixed" },
          { title: "Starting From", value: "startingFrom" },
          { title: "Negotiable", value: "negotiable" },
          { title: "Quote Required", value: "quoteRequired" },
        ],
        layout: "radio",
      },
      initialValue: "quoteRequired",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: "Only fill this in if a price exists.",
    }),

    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
    }),

    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      fromCity: "fromCity.name",
      toCity: "toCity.name",
      vehicleType: "vehicleType",
      priceType: "priceType",
      price: "price",
    },
    prepare(selection) {
      const { title, fromCity, toCity, vehicleType, priceType, price } =
        selection;

      const subtitleParts = [
        fromCity && toCity ? `${fromCity} → ${toCity}` : "",
        vehicleType ? `• ${vehicleType}` : "",
        priceType === "fixed" && price ? `• R${price}` : "",
        priceType === "startingFrom" && price ? `• From R${price}` : "",
        priceType === "negotiable" ? "• Negotiable" : "",
        priceType === "quoteRequired" ? "• Quote Required" : "",
      ].filter(Boolean);

      return {
        title: title || "Untitled Route Rate",
        subtitle: subtitleParts.join(" "),
      };
    },
  },
});
