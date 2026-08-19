import { useState, useEffect, useCallback } from "react";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import ImageDropzone from "@/components/ui/ImageDropzone";
import type {
  SectionKey,
  WhyChooseUsCard,
  ServiceItem,
  Testimonial,
  PricingMenuContent,
  SocialProofStat,
  GalleryImage,
  TeamMember,
  ProcessStep,
  FaqItem,
  BlogPost,
  StoreHighlight,
  StoreCatalogProduct,
  StoreCatalogCategory,
} from "@/lib/content-service";

type Tab =
  | "hero"
  | "why_choose_us"
  | "services"
  | "reviews"
  | "booking"
  | "page_backgrounds"
  | "pricing"
  | "social_proof"
  | "gallery"
  | "team"
  | "process"
  | "faq"
  | "blog"
  | "store"
  | "store_catalog";

const TABS: { key: Tab; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "why_choose_us", label: "Why Choose Us" },
  { key: "social_proof", label: "Social Proof" },
  { key: "services", label: "Services" },
  { key: "gallery", label: "Gallery" },
  { key: "reviews", label: "Reviews" },
  { key: "team", label: "Team" },
  { key: "process", label: "Process" },
  { key: "faq", label: "FAQ" },
  { key: "blog", label: "Blog" },
  { key: "store", label: "Store" },
  { key: "store_catalog", label: "Store Catalog" },
  { key: "booking", label: "Booking" },
  { key: "page_backgrounds", label: "Backgrounds" },
  { key: "pricing", label: "Pricing & Policies" },
];

const SECTION_MAP: Record<Tab, SectionKey> = {
  hero: "hero",
  why_choose_us: "why_choose_us",
  services: "services",
  reviews: "reviews",
  booking: "booking",
  page_backgrounds: "page_backgrounds",
  pricing: "pricing_menu",
  social_proof: "social_proof",
  gallery: "gallery",
  team: "team",
  process: "process",
  faq: "faq",
  blog: "blog",
  store: "store",
  store_catalog: "store_catalog",
};

export function ContentEditor() {
  const { content, updateSection, loading } = useSiteContent();
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable local state per tab
  const [heroForm, setHeroForm] = useState({ ...content.hero });
  const [whyForm, setWhyForm] = useState({
    heading: content.whyChooseUs.heading,
    badge: content.whyChooseUs.badge ?? "",
    story: content.whyChooseUs.story ?? "",
    image: content.whyChooseUs.image ?? "",
    ctaTitle: content.whyChooseUs.ctaTitle ?? "",
    ctaText: content.whyChooseUs.ctaText ?? "",
    ctaLabel: content.whyChooseUs.ctaLabel ?? "",
    cards: [...content.whyChooseUs.cards],
    stats: [...(content.whyChooseUs.stats ?? [])],
  });
  const [servicesForm, setServicesForm] = useState({ heading: content.services.heading, subtitle: content.services.subtitle, items: [...content.services.items] });
  const [reviewsForm, setReviewsForm] = useState({ heading: content.reviews.heading, testimonials: [...content.reviews.testimonials], images: [...content.reviews.images] });
  const [bookingForm, setBookingForm] = useState({ ...content.booking });
  const [bgForm, setBgForm] = useState({ ...content.pageBackgrounds });
  const [pricingForm, setPricingForm] = useState(() => JSON.parse(JSON.stringify(content.pricingMenu)) as PricingMenuContent);
  const [socialProofForm, setSocialProofForm] = useState({ stats: [...content.socialProof.stats] });
  const [galleryForm, setGalleryForm] = useState({ heading: content.gallery.heading, subtitle: content.gallery.subtitle, images: [...content.gallery.images] });
  const [teamForm, setTeamForm] = useState({ heading: content.team.heading, subtitle: content.team.subtitle, members: [...content.team.members] });
  const [processForm, setProcessForm] = useState({ heading: content.process.heading, subtitle: content.process.subtitle, steps: [...content.process.steps] });
  const [faqForm, setFaqForm] = useState({ heading: content.faq.heading, subtitle: content.faq.subtitle, items: [...content.faq.items] });
  const [blogForm, setBlogForm] = useState({ heading: content.blog.heading, subtitle: content.blog.subtitle, posts: [...content.blog.posts] });
  const [storeForm, setStoreForm] = useState({ heading: content.store.heading, subtitle: content.store.subtitle, highlights: [...content.store.highlights] });
  const [storeCatalogForm, setStoreCatalogForm] = useState({
    heading: content.storeCatalog.heading,
    subtitle: content.storeCatalog.subtitle,
    categories: [...content.storeCatalog.categories],
    products: [...content.storeCatalog.products],
  });

  useEffect(() => {
    setHeroForm({ ...content.hero });
    setWhyForm({
      heading: content.whyChooseUs.heading,
      badge: content.whyChooseUs.badge ?? "",
      story: content.whyChooseUs.story ?? "",
      image: content.whyChooseUs.image ?? "",
      ctaTitle: content.whyChooseUs.ctaTitle ?? "",
      ctaText: content.whyChooseUs.ctaText ?? "",
      ctaLabel: content.whyChooseUs.ctaLabel ?? "",
      cards: [...content.whyChooseUs.cards],
      stats: [...(content.whyChooseUs.stats ?? [])],
    });
    setServicesForm({ heading: content.services.heading, subtitle: content.services.subtitle, items: [...content.services.items] });
    setReviewsForm({ heading: content.reviews.heading, testimonials: [...content.reviews.testimonials], images: [...content.reviews.images] });
    setBookingForm({ ...content.booking });
    setBgForm({ ...content.pageBackgrounds });
    setPricingForm(JSON.parse(JSON.stringify(content.pricingMenu)));
    setSocialProofForm({ stats: [...content.socialProof.stats] });
    setGalleryForm({ heading: content.gallery.heading, subtitle: content.gallery.subtitle, images: [...content.gallery.images] });
    setTeamForm({ heading: content.team.heading, subtitle: content.team.subtitle, members: [...content.team.members] });
    setProcessForm({ heading: content.process.heading, subtitle: content.process.subtitle, steps: [...content.process.steps] });
    setFaqForm({ heading: content.faq.heading, subtitle: content.faq.subtitle, items: [...content.faq.items] });
    setBlogForm({ heading: content.blog.heading, subtitle: content.blog.subtitle, posts: [...content.blog.posts] });
    setStoreForm({ heading: content.store.heading, subtitle: content.store.subtitle, highlights: [...content.store.highlights] });
    setStoreCatalogForm({
      heading: content.storeCatalog.heading,
      subtitle: content.storeCatalog.subtitle,
      categories: [...content.storeCatalog.categories],
      products: [...content.storeCatalog.products],
    });
  }, [content]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      const tabData: Record<Tab, Record<string, unknown>> = {
        hero: heroForm,
        why_choose_us: whyForm,
        services: servicesForm,
        reviews: reviewsForm,
        booking: bookingForm,
        page_backgrounds: bgForm,
        pricing: pricingForm as unknown as Record<string, unknown>,
        social_proof: socialProofForm,
        gallery: galleryForm,
        team: teamForm,
        process: processForm,
        faq: faqForm,
        blog: blogForm,
        store: storeForm,
        store_catalog: storeCatalogForm,
      };
      await updateSection(SECTION_MAP[activeTab], tabData[activeTab]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save section:", err);
    } finally {
      setSaving(false);
    }
  }, [activeTab, heroForm, whyForm, servicesForm, reviewsForm, bookingForm, bgForm, pricingForm, socialProofForm, galleryForm, teamForm, processForm, faqForm, blogForm, storeForm, storeCatalogForm, updateSection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-white/60" />
      </div>
    );
  }

  const tab = activeTab;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === t.key
                ? "bg-white text-pink-700"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="text-white">
        {tab === "hero" && (
          <div className="space-y-4">
            <Field label="Title" value={heroForm.title} onChange={(v) => setHeroForm({ ...heroForm, title: v })} />
            <Field label="Subtitle" value={heroForm.subtitle} onChange={(v) => setHeroForm({ ...heroForm, subtitle: v })} textarea />
            <Field label="CTA Button Text" value={heroForm.cta} onChange={(v) => setHeroForm({ ...heroForm, cta: v })} />
            <Field label="Video filename" value={heroForm.video} onChange={(v) => setHeroForm({ ...heroForm, video: v })} />
            <ImageDropzone label="Poster Image" value={heroForm.poster} onChange={(v) => setHeroForm({ ...heroForm, poster: v })} />
          </div>
        )}

        {tab === "why_choose_us" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Field label="Heading" value={whyForm.heading} onChange={(v) => setWhyForm({ ...whyForm, heading: v })} />
            <Field label="Badge (eyebrow)" value={whyForm.badge} onChange={(v) => setWhyForm({ ...whyForm, badge: v })} />
            <Field label="Story Paragraph" value={whyForm.story} onChange={(v) => setWhyForm({ ...whyForm, story: v })} textarea />
            <ImageDropzone label="Center Image" value={whyForm.image} onChange={(v) => setWhyForm({ ...whyForm, image: v })} />
            <div className="grid grid-cols-1 gap-3 pt-2 border-t border-white/10">
              <Field label="CTA Title" value={whyForm.ctaTitle} onChange={(v) => setWhyForm({ ...whyForm, ctaTitle: v })} />
              <Field label="CTA Text" value={whyForm.ctaText} onChange={(v) => setWhyForm({ ...whyForm, ctaText: v })} />
              <Field label="CTA Button Label" value={whyForm.ctaLabel} onChange={(v) => setWhyForm({ ...whyForm, ctaLabel: v })} />
            </div>
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Cards</p>
            {whyForm.cards.map((card, i) => (
              <CardEditor
                key={card.title || i}
                card={card}
                index={i}
                onChange={(updated) => {
                  const cards = [...whyForm.cards];
                  cards[i] = updated;
                  setWhyForm({ ...whyForm, cards });
                }}
                onDelete={() => {
                  const cards = whyForm.cards.filter((_, idx) => idx !== i);
                  setWhyForm({ ...whyForm, cards });
                }}
              />
            ))}
            <button
              onClick={() => setWhyForm({ ...whyForm, cards: [...whyForm.cards, { icon: "", title: "", description: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Card
            </button>
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Stats</p>
            {whyForm.stats.map((stat, i) => (
              <StatEditor
                key={i}
                stat={stat}
                index={i}
                showIcon
                onChange={(updated) => {
                  const stats = [...whyForm.stats];
                  stats[i] = { ...updated, icon: updated.icon ?? "" };
                  setWhyForm({ ...whyForm, stats });
                }}
                onDelete={() => {
                  const stats = whyForm.stats.filter((_, idx) => idx !== i);
                  setWhyForm({ ...whyForm, stats });
                }}
              />
            ))}
            <button
              onClick={() => setWhyForm({ ...whyForm, stats: [...whyForm.stats, { icon: "", value: 0, suffix: "+", label: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Stat
            </button>
          </div>
        )}

        {tab === "services" && (
          <div className="space-y-4">
            <Field label="Heading" value={servicesForm.heading} onChange={(v) => setServicesForm({ ...servicesForm, heading: v })} />
            <Field label="Subtitle" value={servicesForm.subtitle} onChange={(v) => setServicesForm({ ...servicesForm, subtitle: v })} />
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Service Items</p>
            {servicesForm.items.map((item, i) => (
              <ServiceItemEditor
                key={item.id || i}
                item={item}
                index={i}
                onChange={(updated) => {
                  const items = [...servicesForm.items];
                  items[i] = updated;
                  setServicesForm({ ...servicesForm, items });
                }}
                onDelete={() => {
                  const items = servicesForm.items.filter((_, idx) => idx !== i);
                  setServicesForm({ ...servicesForm, items });
                }}
              />
            ))}
            <button
              onClick={() => setServicesForm({ ...servicesForm, items: [...servicesForm.items, { id: "", label: "", icon: "Bath", image: "", description: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Service
            </button>
          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-4">
            <Field label="Heading" value={reviewsForm.heading} onChange={(v) => setReviewsForm({ ...reviewsForm, heading: v })} />
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Testimonials</p>
            {reviewsForm.testimonials.map((t, i) => (
              <TestimonialEditor
                key={t.author || i}
                testimonial={t}
                index={i}
                onChange={(updated) => {
                  const testimonials = [...reviewsForm.testimonials];
                  testimonials[i] = updated;
                  setReviewsForm({ ...reviewsForm, testimonials });
                }}
                onDelete={() => {
                  const testimonials = reviewsForm.testimonials.filter((_, idx) => idx !== i);
                  setReviewsForm({ ...reviewsForm, testimonials });
                }}
              />
            ))}
            <button
              onClick={() => setReviewsForm({ ...reviewsForm, testimonials: [...reviewsForm.testimonials, { emoji: "", author: "", tag: "", text: "", textLong: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Testimonial
            </button>
            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-2">Review Images</p>
              {reviewsForm.images.map((img, i) => (
                <div key={img || i} className="flex gap-2 mb-2 items-start">
                  <div className="flex-1">
                    <ImageDropzone value={img} onChange={(v) => {
                      const images = [...reviewsForm.images];
                      images[i] = v;
                      setReviewsForm({ ...reviewsForm, images });
                    }} />
                  </div>
                  <button
                    onClick={() => {
                      const images = reviewsForm.images.filter((_, idx) => idx !== i);
                      setReviewsForm({ ...reviewsForm, images });
                    }}
                    className="p-2 mt-1 text-red-300 hover:text-red-200 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setReviewsForm({ ...reviewsForm, images: [...reviewsForm.images, ""] })}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Plus size={16} /> Add Image
              </button>
            </div>
          </div>
        )}

        {tab === "booking" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Field label="Heading" value={bookingForm.heading} onChange={(v) => setBookingForm({ ...bookingForm, heading: v })} />
            <Field label="Location" value={bookingForm.location} onChange={(v) => setBookingForm({ ...bookingForm, location: v })} />
            <Field label="Hours" value={bookingForm.hours} onChange={(v) => setBookingForm({ ...bookingForm, hours: v })} />
            <Field label="Phone" value={bookingForm.phone} onChange={(v) => setBookingForm({ ...bookingForm, phone: v })} />
            <Field label="CTA Button Text" value={bookingForm.cta} onChange={(v) => setBookingForm({ ...bookingForm, cta: v })} />
            <Field label="Subtitle" value={bookingForm.subtitle} onChange={(v) => setBookingForm({ ...bookingForm, subtitle: v })} />
            <Field label="Modal Title" value={bookingForm.modalTitle} onChange={(v) => setBookingForm({ ...bookingForm, modalTitle: v })} />
            <Field label="Modal Subtitle" value={bookingForm.modalSubtitle} onChange={(v) => setBookingForm({ ...bookingForm, modalSubtitle: v })} />
            <Field label="Booking Fee Label" value={bookingForm.bookingFeeLabel} onChange={(v) => setBookingForm({ ...bookingForm, bookingFeeLabel: v })} />
            <Field label="Booking Fee Detail" value={bookingForm.bookingFeeDetail} onChange={(v) => setBookingForm({ ...bookingForm, bookingFeeDetail: v })} />
            <Field label="Proceed CTA" value={bookingForm.proceedCta} onChange={(v) => setBookingForm({ ...bookingForm, proceedCta: v })} />
            <Field label="Questions CTA" value={bookingForm.questionsCta} onChange={(v) => setBookingForm({ ...bookingForm, questionsCta: v })} />
            <Field label="Form Title" value={bookingForm.formTitle} onChange={(v) => setBookingForm({ ...bookingForm, formTitle: v })} />
            <Field label="Form Subtitle" value={bookingForm.formSubtitle} onChange={(v) => setBookingForm({ ...bookingForm, formSubtitle: v })} />
            <Field label="Advance Payment Title" value={bookingForm.advancePaymentTitle} onChange={(v) => setBookingForm({ ...bookingForm, advancePaymentTitle: v })} />
            <Field label="Advance Payment Detail" value={bookingForm.advancePaymentDetail} onChange={(v) => setBookingForm({ ...bookingForm, advancePaymentDetail: v })} />
            <Field label="UPI Tooltip" value={bookingForm.upiTooltip} onChange={(v) => setBookingForm({ ...bookingForm, upiTooltip: v })} />
            <Field label="UPI Placeholder" value={bookingForm.upiPlaceholder} onChange={(v) => setBookingForm({ ...bookingForm, upiPlaceholder: v })} />
            <Field label="Submit Label" value={bookingForm.submitLabel} onChange={(v) => setBookingForm({ ...bookingForm, submitLabel: v })} />
            <Field label="Submitting Label" value={bookingForm.submittingLabel} onChange={(v) => setBookingForm({ ...bookingForm, submittingLabel: v })} />
            <Field label="Success Emoji" value={bookingForm.successEmoji} onChange={(v) => setBookingForm({ ...bookingForm, successEmoji: v })} />
            <Field label="Success Title" value={bookingForm.successTitle} onChange={(v) => setBookingForm({ ...bookingForm, successTitle: v })} />
            <Field label="Success Message" value={bookingForm.successMessage} onChange={(v) => setBookingForm({ ...bookingForm, successMessage: v })} textarea />
            <Field label="WhatsApp Number (with country code, e.g. 918798897732)" value={bookingForm.whatsappNumber} onChange={(v) => setBookingForm({ ...bookingForm, whatsappNumber: v })} />
            <Field label="WhatsApp Confirm Message" value={bookingForm.whatsappConfirmMessage} onChange={(v) => setBookingForm({ ...bookingForm, whatsappConfirmMessage: v })} textarea />
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA Icon (emoji)" value={bookingForm.ctaIcon} onChange={(v) => setBookingForm({ ...bookingForm, ctaIcon: v })} />
              <Field label="Location Icon" value={bookingForm.locationIcon} onChange={(v) => setBookingForm({ ...bookingForm, locationIcon: v })} />
              <Field label="Hours Icon" value={bookingForm.hoursIcon} onChange={(v) => setBookingForm({ ...bookingForm, hoursIcon: v })} />
              <Field label="Phone Icon" value={bookingForm.phoneIcon} onChange={(v) => setBookingForm({ ...bookingForm, phoneIcon: v })} />
            </div>
          </div>
        )}

        {tab === "page_backgrounds" && (
          <div className="space-y-4">
            <ImageDropzone label="Why Choose Us Background" value={bgForm.whyChooseUs} onChange={(v) => setBgForm({ ...bgForm, whyChooseUs: v })} />
            <ImageDropzone label="Reviews Background" value={bgForm.reviews} onChange={(v) => setBgForm({ ...bgForm, reviews: v })} />
            <ImageDropzone label="Booking Background" value={bgForm.booking} onChange={(v) => setBgForm({ ...bgForm, booking: v })} />
          </div>
        )}

        {tab === "pricing" && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">
                📋 Basic Services
              </p>
              {pricingForm.basicServices.map((svc, i) => (
                <ServicePriceEditor
                  key={svc.id}
                  label={svc.label}
                  hasFlat={svc.flat !== undefined}
                  prices={svc.prices as PricingMenuContent["basicServices"][number]["prices"]}
                  flat={svc.flat}
                  onPricesChange={(prices) => {
                    const items = [...pricingForm.basicServices];
                    items[i] = { ...items[i], prices };
                    setPricingForm({ ...pricingForm, basicServices: items });
                  }}
                  onFlatChange={(flat) => {
                    const items = [...pricingForm.basicServices];
                    items[i] = { ...items[i], flat };
                    setPricingForm({ ...pricingForm, basicServices: items });
                  }}
                />
              ))}
            </div>

            <div>
              <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">
                🎁 Complete Packages
              </p>
              {pricingForm.completePackages.map((pkg, i) => (
                <ServicePriceEditor
                  key={pkg.id}
                  label={pkg.label}
                  hasFlat={false}
                  prices={pkg.prices as PricingMenuContent["completePackages"][number]["prices"]}
                  onPricesChange={(prices) => {
                    const items = [...pricingForm.completePackages];
                    items[i] = { ...items[i], prices };
                    setPricingForm({ ...pricingForm, completePackages: items });
                  }}
                />
              ))}
            </div>

            <div>
              <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">
                ✨ Add-On Services
              </p>
              {pricingForm.addOnServices.map((addon, i) => (
                <ServicePriceEditor
                  key={addon.id}
                  label={addon.label}
                  hasFlat={addon.flat !== undefined}
                  prices={addon.prices as PricingMenuContent["addOnServices"][number]["prices"]}
                  flat={addon.flat}
                  onPricesChange={(prices) => {
                    const items = [...pricingForm.addOnServices];
                    items[i] = { ...items[i], prices };
                    setPricingForm({ ...pricingForm, addOnServices: items });
                  }}
                  onFlatChange={(flat) => {
                    const items = [...pricingForm.addOnServices];
                    items[i] = { ...items[i], flat };
                    setPricingForm({ ...pricingForm, addOnServices: items });
                  }}
                />
              ))}
            </div>

            <div>
              <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">
                📏 Weight Categories (labels only)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(pricingForm.weightCategories).map(([key, cat]) => (
                  <div key={key} className="bg-white/10 rounded-xl p-2 text-center">
                    <p className="text-white/60 text-[10px] uppercase">{key}</p>
                    <p className="text-white text-xs font-medium">{cat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-xs font-semibold mb-1 uppercase tracking-wider">
                📝 Rules & Policies
              </label>
              <textarea
                value={pricingForm.rules}
                onChange={(e) => setPricingForm({ ...pricingForm, rules: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50 resize-none"
              />
            </div>
          </div>
        )}

        {tab === "social_proof" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Stats</p>
            {socialProofForm.stats.map((stat, i) => (
              <StatEditor
                key={i}
                stat={stat}
                index={i}
                onChange={(updated) => {
                  const stats = [...socialProofForm.stats];
                  stats[i] = updated;
                  setSocialProofForm({ ...socialProofForm, stats });
                }}
                onDelete={() => {
                  const stats = socialProofForm.stats.filter((_, idx) => idx !== i);
                  setSocialProofForm({ ...socialProofForm, stats });
                }}
              />
            ))}
            <button
              onClick={() => setSocialProofForm({ ...socialProofForm, stats: [...socialProofForm.stats, { value: 0, suffix: "+", label: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Stat
            </button>
          </div>
        )}

        {tab === "gallery" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Field label="Heading" value={galleryForm.heading} onChange={(v) => setGalleryForm({ ...galleryForm, heading: v })} />
            <Field label="Subtitle" value={galleryForm.subtitle} onChange={(v) => setGalleryForm({ ...galleryForm, subtitle: v })} />
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Images</p>
            {galleryForm.images.map((img, i) => (
              <GalleryImageEditor
                key={img.url || i}
                image={img}
                index={i}
                onChange={(updated) => {
                  const images = [...galleryForm.images];
                  images[i] = updated;
                  setGalleryForm({ ...galleryForm, images });
                }}
                onDelete={() => {
                  const images = galleryForm.images.filter((_, idx) => idx !== i);
                  setGalleryForm({ ...galleryForm, images });
                }}
              />
            ))}
            <button
              onClick={() => setGalleryForm({ ...galleryForm, images: [...galleryForm.images, { url: "", alt: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Image
            </button>
          </div>
        )}

        {tab === "team" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Field label="Heading" value={teamForm.heading} onChange={(v) => setTeamForm({ ...teamForm, heading: v })} />
            <Field label="Subtitle" value={teamForm.subtitle} onChange={(v) => setTeamForm({ ...teamForm, subtitle: v })} />
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Members</p>
            {teamForm.members.map((member, i) => (
              <TeamMemberEditor
                key={member.name || i}
                member={member}
                index={i}
                onChange={(updated) => {
                  const members = [...teamForm.members];
                  members[i] = updated;
                  setTeamForm({ ...teamForm, members });
                }}
                onDelete={() => {
                  const members = teamForm.members.filter((_, idx) => idx !== i);
                  setTeamForm({ ...teamForm, members });
                }}
              />
            ))}
            <button
              onClick={() => setTeamForm({ ...teamForm, members: [...teamForm.members, { name: "", role: "", bio: "", emoji: "", image: "", mapLink: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Member
            </button>
          </div>
        )}

        {tab === "process" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Field label="Heading" value={processForm.heading} onChange={(v) => setProcessForm({ ...processForm, heading: v })} />
            <Field label="Subtitle" value={processForm.subtitle} onChange={(v) => setProcessForm({ ...processForm, subtitle: v })} />
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Steps</p>
            {processForm.steps.map((step, i) => (
              <ProcessStepEditor
                key={step.step || i}
                step={step}
                index={i}
                onChange={(updated) => {
                  const steps = [...processForm.steps];
                  steps[i] = updated;
                  setProcessForm({ ...processForm, steps });
                }}
                onDelete={() => {
                  const steps = processForm.steps.filter((_, idx) => idx !== i);
                  setProcessForm({ ...processForm, steps });
                }}
              />
            ))}
            <button
              onClick={() => setProcessForm({ ...processForm, steps: [...processForm.steps, { step: processForm.steps.length + 1, title: "", description: "", icon: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Step
            </button>
          </div>
        )}

        {tab === "faq" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Field label="Heading" value={faqForm.heading} onChange={(v) => setFaqForm({ ...faqForm, heading: v })} />
            <Field label="Subtitle" value={faqForm.subtitle} onChange={(v) => setFaqForm({ ...faqForm, subtitle: v })} />
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Items</p>
            {faqForm.items.map((item, i) => (
              <FaqItemEditor
                key={item.q || i}
                item={item}
                index={i}
                onChange={(updated) => {
                  const items = [...faqForm.items];
                  items[i] = updated;
                  setFaqForm({ ...faqForm, items });
                }}
                onDelete={() => {
                  const items = faqForm.items.filter((_, idx) => idx !== i);
                  setFaqForm({ ...faqForm, items });
                }}
              />
            ))}
            <button
              onClick={() => setFaqForm({ ...faqForm, items: [...faqForm.items, { q: "", a: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Question
            </button>
          </div>
        )}

        {tab === "blog" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Field label="Heading" value={blogForm.heading} onChange={(v) => setBlogForm({ ...blogForm, heading: v })} />
            <Field label="Subtitle" value={blogForm.subtitle} onChange={(v) => setBlogForm({ ...blogForm, subtitle: v })} />
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Posts</p>
            {blogForm.posts.map((post, i) => (
              <BlogPostEditor
                key={post.title || i}
                post={post}
                index={i}
                onChange={(updated) => {
                  const posts = [...blogForm.posts];
                  posts[i] = updated;
                  setBlogForm({ ...blogForm, posts });
                }}
                onDelete={() => {
                  const posts = blogForm.posts.filter((_, idx) => idx !== i);
                  setBlogForm({ ...blogForm, posts });
                }}
              />
            ))}
            <button
              onClick={() => setBlogForm({ ...blogForm, posts: [...blogForm.posts, { title: "", excerpt: "", date: "", category: "", image: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Post
            </button>
          </div>
        )}

        {tab === "store" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Field label="Heading" value={storeForm.heading} onChange={(v) => setStoreForm({ ...storeForm, heading: v })} />
            <Field label="Subtitle" value={storeForm.subtitle} onChange={(v) => setStoreForm({ ...storeForm, subtitle: v })} />
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Highlights</p>
            {storeForm.highlights.map((highlight, i) => (
              <StoreHighlightEditor
                key={i}
                highlight={highlight}
                index={i}
                onChange={(updated) => {
                  const highlights = [...storeForm.highlights];
                  highlights[i] = updated;
                  setStoreForm({ ...storeForm, highlights });
                }}
                onDelete={() => {
                  const highlights = storeForm.highlights.filter((_, idx) => idx !== i);
                  setStoreForm({ ...storeForm, highlights });
                }}
              />
            ))}
            <button
              onClick={() => setStoreForm({ ...storeForm, highlights: [...storeForm.highlights, { emoji: "", label: "" }] })}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Highlight
            </button>
          </div>
        )}

        {tab === "store_catalog" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Field label="Heading" value={storeCatalogForm.heading} onChange={(v) => setStoreCatalogForm({ ...storeCatalogForm, heading: v })} />
            <Field label="Subtitle" value={storeCatalogForm.subtitle} onChange={(v) => setStoreCatalogForm({ ...storeCatalogForm, subtitle: v })} />
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Categories</p>
            {storeCatalogForm.categories.map((category, i) => (
              <StoreCategoryEditor
                key={category.id || i}
                category={category}
                index={i}
                onChange={(updated) => {
                  const categories = [...storeCatalogForm.categories];
                  categories[i] = updated;
                  setStoreCatalogForm({ ...storeCatalogForm, categories });
                }}
                onDelete={() => {
                  const categories = storeCatalogForm.categories.filter((_, idx) => idx !== i);
                  setStoreCatalogForm({ ...storeCatalogForm, categories });
                }}
              />
            ))}
            <button
              onClick={() =>
                setStoreCatalogForm({
                  ...storeCatalogForm,
                  categories: [...storeCatalogForm.categories, { id: `cat_${Date.now()}`, name: "", emoji: "" }],
                })
              }
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Category
            </button>
            <p className="text-white/60 text-xs uppercase tracking-wider font-semibold pt-2">Products</p>
            {storeCatalogForm.products.map((product, i) => (
              <StoreProductEditor
                key={product.id || i}
                product={product}
                index={i}
                categories={storeCatalogForm.categories}
                onChange={(updated) => {
                  const products = [...storeCatalogForm.products];
                  products[i] = updated;
                  setStoreCatalogForm({ ...storeCatalogForm, products });
                }}
                onDelete={() => {
                  const products = storeCatalogForm.products.filter((_, idx) => idx !== i);
                  setStoreCatalogForm({ ...storeCatalogForm, products });
                }}
              />
            ))}
            <button
              onClick={() =>
                setStoreCatalogForm({
                  ...storeCatalogForm,
                  products: [
                    ...storeCatalogForm.products,
                    { id: `prod_${Date.now()}`, name: "", category: storeCatalogForm.categories[0]?.id ?? "", price: 0, image: "" },
                  ],
                })
              }
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-pink-700 font-semibold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {saved && (
          <span className="text-green-300 text-sm">✓ Saved!</span>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-white/80 text-xs font-semibold mb-1 uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50"
        />
      )}
    </div>
  );
}

function CardEditor({
  card,
  index,
  onChange,
  onDelete,
}: {
  card: WhyChooseUsCard;
  index: number;
  onChange: (card: WhyChooseUsCard) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Card {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input placeholder="Icon (emoji)" value={card.icon} onChange={(e) => onChange({ ...card, icon: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
          <input placeholder="Title" value={card.title} onChange={(e) => onChange({ ...card, title: e.target.value })} className="flex-[2] px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        </div>
        <textarea placeholder="Description" value={card.description} onChange={(e) => onChange({ ...card, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50 resize-none" />
      </div>
    </div>
  );
}

function ServiceItemEditor({
  item,
  index,
  onChange,
  onDelete,
}: {
  item: ServiceItem;
  index: number;
  onChange: (item: ServiceItem) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Service {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="space-y-2">
        <input placeholder="ID (e.g., luxury-bath)" value={item.id} onChange={(e) => onChange({ ...item, id: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        <input placeholder="Label" value={item.label} onChange={(e) => onChange({ ...item, label: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        <div className="flex gap-2">
          <input placeholder="Icon name (Bath/Scissors/Smile/PawPrint)" value={item.icon} onChange={(e) => onChange({ ...item, icon: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
          <input placeholder="Image URL" value={item.image} onChange={(e) => onChange({ ...item, image: e.target.value })} className="flex-[2] px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        </div>
        <ImageDropzone label="Service Image" value={item.image} onChange={(v) => onChange({ ...item, image: v })} />
        <textarea placeholder="Description" value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50 resize-none" />
      </div>
    </div>
  );
}

function TestimonialEditor({
  testimonial,
  index,
  onChange,
  onDelete,
}: {
  testimonial: Testimonial & { image?: string };
  index: number;
  onChange: (t: Testimonial & { image?: string }) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Testimonial {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input placeholder="Emoji" value={testimonial.emoji} onChange={(e) => onChange({ ...testimonial, emoji: e.target.value })} className="w-20 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
          <input placeholder="Author" value={testimonial.author} onChange={(e) => onChange({ ...testimonial, author: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
          <input placeholder="Tag" value={testimonial.tag} onChange={(e) => onChange({ ...testimonial, tag: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        </div>
        <ImageDropzone label="Avatar Image" value={testimonial.image ?? ""} onChange={(v) => onChange({ ...testimonial, image: v })} />
        <input placeholder="Short text" value={testimonial.text} onChange={(e) => onChange({ ...testimonial, text: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        <textarea placeholder="Long text" value={testimonial.textLong} onChange={(e) => onChange({ ...testimonial, textLong: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50 resize-none" />
      </div>
    </div>
  );
}

function NumInput({ value, onChange, step = 50 }: { value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <input
      type="number"
      min={0}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-full px-2 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs text-center outline-none focus:border-white/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}

function StatEditor({
  stat,
  index,
  onChange,
  onDelete,
  showIcon,
}: {
  stat: SocialProofStat & { icon?: string };
  index: number;
  onChange: (s: SocialProofStat & { icon?: string }) => void;
  onDelete: () => void;
  showIcon?: boolean;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Stat {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="space-y-2">
        {showIcon && (
          <input placeholder="Icon name (PawPrint/Calendar/Users/Star)" value={stat.icon ?? ""} onChange={(e) => onChange({ ...stat, icon: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        )}
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label className="block text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Value</label>
            <NumInput value={stat.value} onChange={(v) => onChange({ ...stat, value: v })} step={0.1} />
          </div>
          <div className="w-20">
            <label className="block text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Suffix</label>
            <input placeholder="+, %, ★" value={stat.suffix} onChange={(e) => onChange({ ...stat, suffix: e.target.value })} className="w-full px-2 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs text-center outline-none focus:border-white/50" />
          </div>
        </div>
        <input placeholder="Label (e.g., Pets Groomed)" value={stat.label} onChange={(e) => onChange({ ...stat, label: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
      </div>
    </div>
  );
}

function GalleryImageEditor({
  image,
  index,
  onChange,
  onDelete,
}: {
  image: GalleryImage;
  index: number;
  onChange: (img: GalleryImage) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Image {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="space-y-2">
        <ImageDropzone label="Image" value={image.url} onChange={(v) => onChange({ ...image, url: v })} />
        <input placeholder="Alt text" value={image.alt} onChange={(e) => onChange({ ...image, alt: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
      </div>
    </div>
  );
}

function TeamMemberEditor({
  member,
  index,
  onChange,
  onDelete,
}: {
  member: TeamMember;
  index: number;
  onChange: (m: TeamMember) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Recommended Vet {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input placeholder="Name" value={member.name} onChange={(e) => onChange({ ...member, name: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
          <input placeholder="Role / Credentials" value={member.role} onChange={(e) => onChange({ ...member, role: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        </div>
        <textarea placeholder="Editorial Bio (Use \n\n for paragraphs)" value={member.bio} onChange={(e) => onChange({ ...member, bio: e.target.value })} rows={10} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50 resize-none" />
        <div className="flex gap-2">
          <input placeholder="Emoji Icon" value={member.emoji} onChange={(e) => onChange({ ...member, emoji: e.target.value })} className="w-28 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
          <input placeholder="Google Maps link (optional)" value={member.mapLink} onChange={(e) => onChange({ ...member, mapLink: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        </div>
      </div>
    </div>
  );
}

function ProcessStepEditor({
  step,
  index,
  onChange,
  onDelete,
}: {
  step: ProcessStep;
  index: number;
  onChange: (s: ProcessStep) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Step {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="w-20">
            <label className="block text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Step #</label>
            <NumInput value={step.step} onChange={(v) => onChange({ ...step, step: v })} step={1} />
          </div>
          <input placeholder="Icon (emoji)" value={step.icon} onChange={(e) => onChange({ ...step, icon: e.target.value })} className="w-24 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
          <input placeholder="Title" value={step.title} onChange={(e) => onChange({ ...step, title: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        </div>
        <textarea placeholder="Description" value={step.description} onChange={(e) => onChange({ ...step, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50 resize-none" />
      </div>
    </div>
  );
}

function FaqItemEditor({
  item,
  index,
  onChange,
  onDelete,
}: {
  item: FaqItem;
  index: number;
  onChange: (i: FaqItem) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Question {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="space-y-2">
        <input placeholder="Question" value={item.q} onChange={(e) => onChange({ ...item, q: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        <textarea placeholder="Answer" value={item.a} onChange={(e) => onChange({ ...item, a: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50 resize-none" />
      </div>
    </div>
  );
}

function BlogPostEditor({
  post,
  index,
  onChange,
  onDelete,
}: {
  post: BlogPost;
  index: number;
  onChange: (p: BlogPost) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Post {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="space-y-2">
        <input placeholder="Title" value={post.title} onChange={(e) => onChange({ ...post, title: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        <textarea placeholder="Excerpt" value={post.excerpt} onChange={(e) => onChange({ ...post, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50 resize-none" />
        <div className="flex gap-2">
          <input placeholder="Date" value={post.date} onChange={(e) => onChange({ ...post, date: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
          <input placeholder="Category" value={post.category} onChange={(e) => onChange({ ...post, category: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        </div>
        <ImageDropzone label="Cover Image" value={post.image} onChange={(v) => onChange({ ...post, image: v })} />
      </div>
    </div>
  );
}

function StoreHighlightEditor({
  highlight,
  index,
  onChange,
  onDelete,
}: {
  highlight: StoreHighlight;
  index: number;
  onChange: (h: StoreHighlight) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Highlight {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="flex gap-2">
        <input placeholder="Emoji" value={highlight.emoji} onChange={(e) => onChange({ ...highlight, emoji: e.target.value })} className="w-24 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        <input placeholder="Label" value={highlight.label} onChange={(e) => onChange({ ...highlight, label: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
      </div>
    </div>
  );
}

function ServicePriceEditor({
  label,
  hasFlat,
  prices,
  flat,
  onPricesChange,
  onFlatChange,
}: {
  label: string;
  hasFlat: boolean;
  prices?: { small: number; medium: number; large: number; xlarge: number };
  flat?: number;
  onPricesChange?: (p: { small: number; medium: number; large: number; xlarge: number }) => void;
  onFlatChange?: (f: number) => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-2">
      <p className="text-white/70 text-xs font-medium mb-2">{label}</p>
      {hasFlat ? (
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-[10px] uppercase tracking-wider w-16">Flat Rate</span>
          <div className="w-24">
            <NumInput value={flat ?? 0} onChange={(v) => onFlatChange?.(v)} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {(["small", "medium", "large", "xlarge"] as const).map((size) => (
            <div key={size}>
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5 text-center">{size}</p>
              <NumInput
                value={prices?.[size] ?? 0}
                onChange={(v) => onPricesChange?.({ ...prices!, [size]: v })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StoreCategoryEditor({
  category,
  index,
  onChange,
  onDelete,
}: {
  category: StoreCatalogCategory;
  index: number;
  onChange: (c: StoreCatalogCategory) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Category {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="flex gap-2">
        <input placeholder="Emoji" value={category.emoji} onChange={(e) => onChange({ ...category, emoji: e.target.value })} className="w-24 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
        <input placeholder="Name (e.g., Clothes)" value={category.name} onChange={(e) => onChange({ ...category, name: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
      </div>
    </div>
  );
}

function StoreProductEditor({
  product,
  index,
  categories,
  onChange,
  onDelete,
}: {
  product: StoreCatalogProduct;
  index: number;
  categories: StoreCatalogCategory[];
  onChange: (p: StoreCatalogProduct) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/50 text-xs">Product {index + 1}</span>
        <button onClick={onDelete} className="text-red-300 hover:text-red-200"><Trash2 size={14} /></button>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input placeholder="Name (e.g., Cozy Winter Jacket)" value={product.name} onChange={(e) => onChange({ ...product, name: e.target.value })} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50" />
          <select
            value={product.category}
            onChange={(e) => onChange({ ...product, category: e.target.value })}
            className="w-44 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-white/50"
          >
            {categories.length === 0 && <option value="">No categories yet</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="text-black">{c.name || c.id}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-28">
            <label className="block text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Price (₹)</label>
            <input type="text" value={product.price} onChange={(e) => onChange({ ...product, price: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-white/50" />
          </div>
          <div className="flex-1">
            <label className="block text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Badge (optional)</label>
            <input placeholder="e.g., New" value={product.badge ?? ""} onChange={(e) => onChange({ ...product, badge: e.target.value })} className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs outline-none focus:border-white/50" />
          </div>
          <label className="flex items-center gap-2 text-white/60 text-xs cursor-pointer pt-4">
            <input
              type="checkbox"
              checked={product.soldOut ?? false}
              onChange={(e) => onChange({ ...product, soldOut: e.target.checked })}
              className="accent-pink-400"
            />
            Sold out
          </label>
        </div>
        <ImageDropzone label="Photo" value={product.image} onChange={(v) => onChange({ ...product, image: v })} />
      </div>
    </div>
  );
}

export default ContentEditor;
