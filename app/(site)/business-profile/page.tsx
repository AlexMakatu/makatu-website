import type { Metadata } from "next";
import BusinessProfilePresentation from "@/components/business-profile/BusinessProfilePresentation";
import { client } from "@/sanity/lib/client";
import { businessProfileQuery } from "@/sanity/queries/getBusinessProfile";
import type { BusinessProfile, LeadershipProfile } from "@/types/businessProfile";

export const metadata: Metadata = {
  title: "Business Profile | Makatu Business Enterprises",
  description:
    "Makatu Business Enterprises company profile, fleet capacity, leadership, credentials and nationwide vehicle-transport capability.",
};

export const dynamic = "force-dynamic";

const defaults: BusinessProfile = {
  title: "Makatu Business Enterprises",
  tagline: "Not your average logistics partner",
  intro:
    "A dynamic South African vehicle-logistics business delivering transparent, reliable and technology-enabled transport solutions nationwide.",
  whyChooseUs: [
    {
      title: "Dynamic and ambitious",
      description:
        "We combine entrepreneurial energy with accountable delivery, adapting quickly to client requirements while remaining focused on measurable service performance.",
      displayOrder: 1,
    },
    {
      title: "Vehicle-logistics expertise",
      description:
        "Our team brings practical experience across major automotive contracts, dealer distribution, yard operations, customer care and long-haul transport.",
      displayOrder: 2,
    },
    {
      title: "Real-time visibility",
      description:
        "Our operational systems provide status visibility from instruction and scheduling through collection, transit, delivery and electronic proof of delivery.",
      displayOrder: 3,
    },
    {
      title: "Transformation in action",
      description:
        "Makatu supports meaningful participation, employment and supplier development while building sustainable operational capability.",
      displayOrder: 4,
    },
  ],
  bbbeeLevel: "B-BBEE compliant",
  bbbeeSummary:
    "Our current B-BBEE credentials reflect Makatu's commitment to transformation, inclusive growth and sustainable participation in South Africa's logistics sector.",
  insuranceAmount: "Comprehensive cover",
  insuranceSummary:
    "Goods-in-transit protection is maintained to support responsible vehicle movements. Current confirmation of cover can be accessed directly from this profile.",
  dailyLocalCapacity: 140,
  weeklyLongHaulCapacity: "20-30",
  fleet: [
    {
      title: "Six-car carrier",
      description: "Configured for six to seven smaller vehicles or five larger vehicles.",
      status: "Operational",
      displayOrder: 1,
    },
    {
      title: "Eight-car carrier",
      description: "Configured for up to eight smaller vehicles or six larger vehicles.",
      status: "Operational",
      displayOrder: 2,
    },
    {
      title: "Three-car carrier",
      description: "Flexible smaller carrier capacity for targeted routes and urgent movements.",
      status: "Operational",
      displayOrder: 3,
    },
  ],
  processSteps: [
    { title: "Instruction", description: "The transport instruction is received, validated and captured.", displayOrder: 1 },
    { title: "Planning", description: "The vehicle is allocated to the appropriate route, carrier and schedule.", displayOrder: 2 },
    { title: "Collection", description: "Condition, keys and required information are verified at handover.", displayOrder: 3 },
    { title: "In transit", description: "Operational progress and exceptions are monitored through delivery.", displayOrder: 4 },
    { title: "Delivery", description: "Final condition and handover are recorded with electronic proof of delivery.", displayOrder: 5 },
  ],
  leadTimes: [
    { route: "Gauteng local", collection: "Scheduled daily", delivery: "Typically 1-2 working days", displayOrder: 1 },
    { route: "Cape Town to Gauteng", collection: "Route schedule", delivery: "Target 5 working days", displayOrder: 2 },
    { route: "Other long-haul routes", collection: "Carrier availability", delivery: "Confirmed per route", displayOrder: 3 },
  ],
  operatingHours: "06:00-23:00",
  paymentTerms: "30 days",
  serviceArea: "Nationwide South Africa",
  clients: [
    { name: "Ford South Africa", services: "Vehicle logistics, remarketing and operational support.", displayOrder: 1 },
    { name: "BMW South Africa", services: "Dealer-to-dealer vehicle transport and operational coordination.", displayOrder: 2 },
    { name: "3G Relocations", services: "Specialist vehicle-relocation support.", displayOrder: 3 },
  ],
  contactHeading: "Let us move your business forward",
  contactText:
    "Talk to Makatu about a transparent, responsive and accountable vehicle-transport solution built around your operation.",
  contactEmail: "info@makatu.co.za",
  contactPhone: "+27 87 265 1140",
  website: "https://makatu.co.za",
};

function mergeProfile(
  profile: BusinessProfile | null | undefined,
  fallbackLeadership: LeadershipProfile[] = [],
): BusinessProfile {
  return {
    ...defaults,
    ...profile,
    whyChooseUs:
      profile?.whyChooseUs?.length ? profile.whyChooseUs : defaults.whyChooseUs,
    fleet: profile?.fleet?.length ? profile.fleet : defaults.fleet,
    processSteps:
      profile?.processSteps?.length
        ? profile.processSteps
        : defaults.processSteps,
    leadTimes:
      profile?.leadTimes?.length ? profile.leadTimes : defaults.leadTimes,
    clients: profile?.clients?.length ? profile.clients : defaults.clients,
    leadership:
      profile?.leadership?.length ? profile.leadership : fallbackLeadership,
  };
}

export default async function BusinessProfilePage() {
  let data: {
    profile?: BusinessProfile | null;
    fallbackLeadership?: LeadershipProfile[];
  } = {};

  try {
    data = await client.fetch(businessProfileQuery, {}, { cache: "no-store" });
  } catch (error) {
    console.error("Unable to load the Sanity business profile:", error);
  }

  return (
    <BusinessProfilePresentation
      profile={mergeProfile(data.profile, data.fallbackLeadership)}
    />
  );
}
