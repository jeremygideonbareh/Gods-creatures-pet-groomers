import { gql } from "@apollo/client";
import { GET_SITE_CONTENT } from "@/lib/graphql";

export interface WhyChooseUsCard {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  label: string;
  icon: string;
  image: string;
  description: string;
}

export interface Testimonial {
  emoji: string;
  author: string;
  tag: string;
  text: string;
  textLong: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta: string;
  video: string;
  poster: string;
}

export interface WhyChooseUsContent {
  heading: string;
  cards: WhyChooseUsCard[];
}

export interface ServicesContent {
  heading: string;
  subtitle: string;
  items: ServiceItem[];
}

export interface ReviewsContent {
  heading: string;
  testimonials: Testimonial[];
  images: string[];
}

export interface BookingContent {
  heading: string;
  location: string;
  hours: string;
  phone: string;
  cta: string;
  subtitle: string;
  ctaIcon: string;
  locationIcon: string;
  hoursIcon: string;
  phoneIcon: string;
  modalTitle: string;
  modalSubtitle: string;
  bookingFeeLabel: string;
  bookingFeeDetail: string;
  proceedCta: string;
  questionsCta: string;
  formTitle: string;
  formSubtitle: string;
  advancePaymentTitle: string;
  advancePaymentDetail: string;
  upiTooltip: string;
  upiPlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successEmoji: string;
  successTitle: string;
  successMessage: string;
}

export interface PageBackgroundsContent {
  whyChooseUs: string;
  reviews: string;
  booking: string;
}

export interface DesignTokensContent {
  brandPink: string;
  darkPink: string;
}

export interface PricingSizePrices {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

export interface PricingServiceItem {
  id: string;
  label: string;
  prices?: PricingSizePrices;
  flat?: number;
}

export interface PricingWeightCategories {
  small: { label: string; maxKg: number };
  medium: { label: string; maxKg: number };
  large: { label: string; maxKg: number };
  xlarge: { label: string; maxKg: number };
}

export interface PricingMenuContent {
  rules: string;
  basicServices: PricingServiceItem[];
  completePackages: PricingServiceItem[];
  addOnServices: PricingServiceItem[];
  boardingRates?: {
    label: string;
    note: string;
    cta: string;
    phone: string;
    rates: { small: number; medium: number; large: number; xlarge: number };
  };
  weightCategories: PricingWeightCategories;
}

export interface SiteContent {
  hero: HeroContent;
  whyChooseUs: WhyChooseUsContent;
  services: ServicesContent;
  reviews: ReviewsContent;
  booking: BookingContent;
  pageBackgrounds: PageBackgroundsContent;
  designTokens: DesignTokensContent;
  pricingMenu: PricingMenuContent;
}

export type SectionKey =
  | "hero"
  | "why_choose_us"
  | "services"
  | "reviews"
  | "booking"
  | "page_backgrounds"
  | "design_tokens"
  | "pricing_menu";

const SECTION_MAP: Record<SectionKey, keyof SiteContent> = {
  hero: "hero",
  why_choose_us: "whyChooseUs",
  services: "services",
  reviews: "reviews",
  booking: "booking",
  page_backgrounds: "pageBackgrounds",
  design_tokens: "designTokens",
  pricing_menu: "pricingMenu",
};

export { GET_SITE_CONTENT as GET_ALL_SITE_CONTENT };

export const UPSERT_SITE_CONTENT = gql`
  mutation UpsertSiteContent($section: String!, $content: jsonb!) {
    insert_site_content_one(
      object: { section: $section, content: $content }
      on_conflict: {
        constraint: site_content_section_key
        update_columns: [content, updated_at]
      }
    ) { id section }
  }
`;

export function mapDbToSiteContent(
  rows: { section: string; content: Record<string, unknown> }[] | undefined,
  defaults: SiteContent
): SiteContent {
  if (!rows || rows.length === 0) return defaults;
  const result = { ...defaults };
  for (const row of rows) {
    const key = SECTION_MAP[row.section as SectionKey];
    if (key && typeof row.content === "object") {
      (result as Record<string, unknown>)[key] = {
        ...(defaults[key] as unknown as Record<string, unknown>),
        ...row.content,
      };
    }
  }
  return result;
}
