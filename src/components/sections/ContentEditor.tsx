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
} from "@/lib/content-service";

type Tab = "hero" | "why_choose_us" | "services" | "reviews" | "booking" | "page_backgrounds" | "pricing";

const TABS: { key: Tab; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "why_choose_us", label: "Why Choose Us" },
  { key: "services", label: "Services" },
  { key: "reviews", label: "Reviews" },
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
};

export function ContentEditor() {
  const { content, updateSection, loading } = useSiteContent();
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable local state per tab
  const [heroForm, setHeroForm] = useState({ ...content.hero });
  const [whyForm, setWhyForm] = useState({ heading: content.whyChooseUs.heading, cards: [...content.whyChooseUs.cards] });
  const [servicesForm, setServicesForm] = useState({ heading: content.services.heading, subtitle: content.services.subtitle, items: [...content.services.items] });
  const [reviewsForm, setReviewsForm] = useState({ heading: content.reviews.heading, testimonials: [...content.reviews.testimonials], images: [...content.reviews.images] });
  const [bookingForm, setBookingForm] = useState({ ...content.booking });
  const [bgForm, setBgForm] = useState({ ...content.pageBackgrounds });
  const [pricingForm, setPricingForm] = useState(() => JSON.parse(JSON.stringify(content.pricingMenu)) as PricingMenuContent);

  useEffect(() => {
    setHeroForm({ ...content.hero });
    setWhyForm({ heading: content.whyChooseUs.heading, cards: [...content.whyChooseUs.cards] });
    setServicesForm({ heading: content.services.heading, subtitle: content.services.subtitle, items: [...content.services.items] });
    setReviewsForm({ heading: content.reviews.heading, testimonials: [...content.reviews.testimonials], images: [...content.reviews.images] });
    setBookingForm({ ...content.booking });
    setBgForm({ ...content.pageBackgrounds });
    setPricingForm(JSON.parse(JSON.stringify(content.pricingMenu)));
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
      };
      await updateSection(SECTION_MAP[activeTab], tabData[activeTab]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save section:", err);
    } finally {
      setSaving(false);
    }
  }, [activeTab, heroForm, whyForm, servicesForm, reviewsForm, bookingForm, bgForm, pricingForm, updateSection]);

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
          <div className="space-y-4">
            <Field label="Heading" value={whyForm.heading} onChange={(v) => setWhyForm({ ...whyForm, heading: v })} />
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

function NumInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      min={0}
      step={50}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      className="w-full px-2 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs text-center outline-none focus:border-white/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
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

export default ContentEditor;
