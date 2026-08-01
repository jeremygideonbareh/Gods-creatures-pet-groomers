import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useApolloClient } from "@apollo/client/react";
import {
  GET_ALL_SITE_CONTENT,
  UPSERT_SITE_CONTENT,
  mapDbToSiteContent,
  type SiteContent,
  type SectionKey,
} from "@/lib/content-service";
import {
  designTokens,
  hero,
  whyChooseUs,
  services,
  reviews,
  bookingSection,
  pageBackgrounds,
  PRICING_MENU,
  socialProof,
  gallery,
  team,
  process,
  faq,
  blog,
  store,
} from "@/config/site-content";

const DEFAULTS: SiteContent = {
  hero: hero as unknown as SiteContent["hero"],
  whyChooseUs: whyChooseUs as unknown as SiteContent["whyChooseUs"],
  services: services as unknown as SiteContent["services"],
  reviews: reviews as unknown as SiteContent["reviews"],
  booking: bookingSection as unknown as SiteContent["booking"],
  pageBackgrounds: pageBackgrounds as unknown as SiteContent["pageBackgrounds"],
  designTokens: designTokens as unknown as SiteContent["designTokens"],
  pricingMenu: PRICING_MENU as unknown as SiteContent["pricingMenu"],
  socialProof: socialProof as unknown as SiteContent["socialProof"],
  gallery: gallery as unknown as SiteContent["gallery"],
  team: team as unknown as SiteContent["team"],
  process: process as unknown as SiteContent["process"],
  faq: faq as unknown as SiteContent["faq"],
  blog: blog as unknown as SiteContent["blog"],
  store: store as unknown as SiteContent["store"],
};

interface SiteContentState {
  content: SiteContent;
  loading: boolean;
  updateSection: (section: SectionKey, data: Record<string, unknown>) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentState>({
  content: DEFAULTS,
  loading: true,
  updateSection: async () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const apolloClient = useApolloClient();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await apolloClient.query<{
          site_content: { section: string; content: Record<string, unknown> }[];
        }>({
          query: GET_ALL_SITE_CONTENT,
          fetchPolicy: "network-only",
        });
        setContent(mapDbToSiteContent(data?.site_content, DEFAULTS));
      } catch (err) {
        console.error("Failed to fetch site content, using defaults:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [apolloClient]);

  const updateSection = useCallback(
    async (section: SectionKey, data: Record<string, unknown>) => {
      await apolloClient.mutate({
        mutation: UPSERT_SITE_CONTENT,
        variables: { section, content: data },
      });
      setContent((prev) => {
        const merged = {
          ...(prev[SECTION_KEY_MAP[section]] as unknown as Record<string, unknown>),
          ...data,
        };
        return { ...prev, [SECTION_KEY_MAP[section]]: merged as unknown as SiteContent[keyof SiteContent] };
      });
    },
    [apolloClient]
  );

  return (
    <SiteContentContext.Provider value={{ content, loading, updateSection }}>
      {children}
    </SiteContentContext.Provider>
  );
}

const SECTION_KEY_MAP: Record<SectionKey, keyof SiteContent> = {
  hero: "hero",
  why_choose_us: "whyChooseUs",
  services: "services",
  reviews: "reviews",
  booking: "booking",
  page_backgrounds: "pageBackgrounds",
  design_tokens: "designTokens",
  pricing_menu: "pricingMenu",
  social_proof: "socialProof",
  gallery: "gallery",
  team: "team",
  process: "process",
  faq: "faq",
  blog: "blog",
  store: "store",
};

export function useSiteContent() {
  return useContext(SiteContentContext);
}
