export type SanityAsset = {
  url?: string;
};

export type SanityImage = {
  asset?: SanityAsset;
};

export type ProfileReason = {
  _key?: string;
  title: string;
  description?: string;
  displayOrder?: number;
};

export type FleetItem = {
  _key?: string;
  title: string;
  description?: string;
  quantity?: number;
  status?: string;
  displayOrder?: number;
  image?: SanityImage;
};

export type LeadTime = {
  _key?: string;
  route: string;
  collection?: string;
  delivery?: string;
  displayOrder?: number;
};

export type ProcessStep = {
  _key?: string;
  title: string;
  description?: string;
  displayOrder?: number;
};

export type LeadershipProfile = {
  _id: string;
  fullName: string;
  position: string;
  bio?: string;
  leadershipProfile?: string;
  yearsExperience?: number;
  displayOrder?: number;
  photo?: SanityImage;
  department?: { title?: string };
};

export type ClientReference = {
  _key?: string;
  name: string;
  services?: string;
  contactName?: string;
  contactPhone?: string;
  showContactPublicly?: boolean;
  displayOrder?: number;
  logo?: SanityImage;
};

export type BusinessProfile = {
  title?: string;
  tagline?: string;
  intro?: string;
  heroImage?: SanityImage;
  whyChooseUs?: ProfileReason[];
  bbbeeLevel?: string;
  bbbeeSummary?: string;
  bbbeeCertificateUrl?: string;
  insuranceAmount?: string;
  insuranceSummary?: string;
  insuranceDocumentUrl?: string;
  dailyLocalCapacity?: number;
  weeklyLongHaulCapacity?: string;
  fleet?: FleetItem[];
  leadTimes?: LeadTime[];
  processSteps?: ProcessStep[];
  operatingHours?: string;
  paymentTerms?: string;
  serviceArea?: string;
  leadership?: LeadershipProfile[];
  clients?: ClientReference[];
  contactHeading?: string;
  contactText?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  publishedAt?: string;
};
