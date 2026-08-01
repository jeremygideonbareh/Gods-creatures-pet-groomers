import type {
  SocialProofContent,
  GalleryContent,
  TeamContent,
  ProcessContent,
  FaqContent,
  BlogContent,
  StoreContent,
  StoreCatalogContent,
} from "@/lib/content-service";

const raw = import.meta.env.VITE_ADMIN_EMAIL ?? "cloudlyconfusing@gmail.com";
const adminEmailList = raw.split(",").map((s: string) => s.trim().toLowerCase());
export const adminEmails = [...new Set([...adminEmailList, "cloudlyconfusing@gmail.com", "vivecablah@gmail.com"])];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails.includes(email.toLowerCase());
}

export const RUPEESIGN = "\u20B9";

export const designTokens = {
  brandPink: "#d0999a",
  darkPink: "#c48a8b",
  brandCream: "#faf3ec",
  brandCharcoal: "#1c1c1c",
  brandIvory: "#f5f0e8",
  // NEW semantic tokens
  brandPinkLight: "#f0e0e0",
  brandPinkDark: "#a87a7b",
  brandCreamDark: "#f0e8dc",
  brandCreamLight: "#fffcf7",
  fontHeading: "'DM Serif Display', Georgia, serif",
  fontBody: "'Inter', system-ui, -apple-system, sans-serif",
  transitionDefault: "cubic-bezier(0.16, 1, 0.3, 1)",
  transitionBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const hero = {
  title: "Gods Creatures Pet Groomers",
  subtitle:
    "Luxury grooming by experienced professionals \u2014 only the finest for your pet.",
  cta: "Book Appointment",
  video: "herosectionvideo.mp4",
  poster: "hero-poster.jpg",
} as const;

export const pageBackgrounds = {
  whyChooseUs:
    "https://images.unsplash.com/photo-1544568100-847a948585b9?w=900&auto=format&fit=crop&q=60",
  reviews:
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&auto=format&fit=crop&q=60",
  booking:
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&auto=format&fit=crop&q=60",
} as const;

export const whyChooseUs = {
  heading: "About Us",
  cards: [
    {
      icon: "🩺",
      title: "Vet-Backed Wellness",
      description:
        "Years of veterinary partnership ensuring every pet receives the highest standard of preventive care.",
    },
    {
      icon: "🧴",
      title: "Luxury Spa Grooming",
      description:
        "Premium imported products and gentle techniques by trained professionals who treat every pet like royalty.",
    },
    {
      icon: "🕐",
      title: "Years of Expertise",
      description:
        "Decades of combined experience \u2014 our well-trained team brings mastery and passion to every appointment.",
    },
    {
      icon: "✨",
      title: "Luxury Imported Products",
      description:
        "Premium shampoos, conditioners & treatments sourced from around the world for that extra touch of indulgence.",
    },
  ],
  badge: "OUR GROOMING PHILOSOPHY",
  story:
    "Luxury grooming by experienced professionals \u2014 only the finest for your pet.",
  image:
    "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=900&auto=format&fit=crop&q=60",
  ctaTitle: "Ready to pamper your pet?",
  ctaText: "Book a session and watch their tail wag brighter.",
  ctaLabel: "Book a Session",
  stats: [
    { icon: "PawPrint", value: 500, suffix: "+", label: "Pets Groomed" },
    { icon: "Calendar", value: 8, suffix: "+", label: "Years Experience" },
    { icon: "Users", value: 98, suffix: "%", label: "Happy Clients" },
    { icon: "Star", value: 4.4, suffix: "\u2605", label: "Avg. Rating" },
  ],
} as const;

export const services = {
  heading: "Our Signature Services",
  subtitle: "Expertly crafted using the finest imported products.",
  items: [
    {
      id: "luxury-bath",
      label: "Luxury bath & blow-dry",
      icon: "Bath",
      image:
        "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=900&auto=format&fit=crop&q=60",
      description:
        "Soft pastel shampoos, deep conditioning, and fluffy finishes. High premium imported products for extra care.",
    },
    {
      id: "stylish-haircut",
      label: "Stylish haircut",
      icon: "Scissors",
      image:
        "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=900&auto=format&fit=crop&q=60",
      description:
        "Precision styling by experienced groomers who understand every breed's unique beauty \u2014 using professional-grade tools for a flawless finish.",
    },
    {
      id: "dental-hygiene",
      label: "Dental hygiene",
      icon: "Smile",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&auto=format&fit=crop&q=60",
      description:
        "Professional dental care backed by years of veterinary expertise for a sparkling healthy smile.",
    },
    {
      id: "pawdicure",
      label: "Pawdicure & nail art",
      icon: "PawPrint",
      image:
        "https://images.unsplash.com/photo-1544568100-847a948585b9?w=900&auto=format&fit=crop&q=60",
      description:
        "Gentle paw care with imported balms and creative pet-safe colours, handled with expert precision and care.",
    },
  ],
} as const;

export const reviews = {
  heading: "Happy Clients",
  testimonials: [
    {
      emoji: "🐕",
      author: "Bruno's Mom",
      tag: "Regular since 2023",
      text: 'The grooming transformed my anxious rescue into a fluffy star. He actually pulls me toward the salon now!',
      textLong:
        'The level of care and expertise is unmatched. Bruno has never looked more luxurious \u2014 the imported products make such a difference!',
    },
    {
      emoji: "🐩",
      author: "Coco's Dad",
      tag: "Grooming + Wellness",
      text: 'The dental hygiene program saved us a fortune in vet bills. Plus Coco smells amazing for weeks!',
      textLong:
        "The experienced team transformed Coco's coat completely. Years of expertise really show \u2014 we've never been happier!",
    },
  ],
  images: [
    "review-image1.png",
    "review-image2.png",
    "review-image3.png",
    "reviewimage5.jpeg",
  ],
} as const;

export const bookingSection = {
  heading: "Book Now",
  location: "Malki, Nongshiliang, Shillong, Meghalaya - 793001",
  hours: "Mon/Tue/Thu/Fri 9–11am & 2–7pm · Wed 9am–1pm · Sat 1–5pm · Sun by appointment",
  phone: "8798897732",
  cta: "Book a Session",
  subtitle: "Walk-ins possible? Just give us a ring!",
  ctaIcon: "🐾",
  locationIcon: "📍",
  hoursIcon: "🕐",
  phoneIcon: "📞",
  modalTitle: "Book a Session",
  modalSubtitle: "Secure your spot — we'll take care of the rest!",
  bookingFeeLabel: `${RUPEESIGN}500 booking fee`,
  bookingFeeDetail:
    `Booking by appointment only. A ${RUPEESIGN}500 booking fee is required (adjusted in your final bill).`,
  proceedCta: "Proceed to Schedule",
  questionsCta: "Questions? Call us directly!",
  formTitle: "Book a Session",
  formSubtitle: "Fill in the details and we'll get back to you!",
  advancePaymentTitle: `Advance Payment (${RUPEESIGN}500)`,
  advancePaymentDetail:
    `A ${RUPEESIGN}500 booking fee is required (adjusted in your final bill). GPay to: 9089196235@axisbank`,
  upiTooltip:
    "GPay UPI: 9089196235@axisbank",
  upiPlaceholder: "GPay UPI Reference No. / Transaction ID *",
  submitLabel: "send request",
  submittingLabel: "Sending...",
  successEmoji: "🎉",
  successTitle: "Woohoo!",
  successMessage:
    "Your request has been sent. We'll get back to you with a confirmed slot!",
} as const;

// ========== NEW CONTENT SECTIONS ==========

export const teamMembers = [
  {
    name: "Dr. Kakoty",
    role: "Go-To Vet · Animal Concern, Motinagar",
    image: "",
    bio: "Senior-most private vet in Shillong. Diagnoses by symptoms and refers for blood tests/equipment when needed. Google his location to find the clinic.",
    emoji: "🩺",
    mapLink: "https://www.google.com/maps/search/Animal+Concern+Motinagar+Shillong",
  },
  {
    name: "Dr. Warjri",
    role: "Veterinary Partner",
    image: "",
    bio: "Our trusted veterinary partner ensuring every grooming session meets the highest standards of pet health and safety. Photo coming soon.",
    emoji: "🩺",
    mapLink: "",
  },
] as const;

export const processSteps = [
  {
    step: 1,
    title: "Book a Session",
    description: "Choose your preferred service, date, and time. Our booking system makes it easy to schedule your pet's grooming session.",
    icon: "📅",
  },
  {
    step: 2,
    title: "Drop Off Your Pet",
    description: "Bring your furry friend to our salon in Malki. We'll discuss your requirements and take notes on any special needs.",
    icon: "🚗",
  },
  {
    step: 3,
    title: "Pamper & Pick Up",
    description: "We groom with care using premium products. You'll receive a notification when your pet is ready for collection — looking their absolute best!",
    icon: "✨",
  },
] as const;

export const faqItems = [
  {
    q: "How long does a grooming session take?",
    a: "Most sessions take 1.5–3 hours depending on the service and your pet's size, breed, and temperament. Full spa packages may take longer. We'll give you an estimated time when you book.",
  },
  {
    q: "What products do you use?",
    a: "We use only premium imported shampoos, conditioners, and treatments — all vet-approved and suitable for sensitive skin. We carry hypoallergenic options too.",
  },
  {
    q: "Do I need to book in advance?",
    a: "Yes, we operate by appointment only to ensure each pet gets undivided attention. A ₹500 booking fee secures your slot and is adjusted in your final bill.",
  },
  {
    q: "What if my pet is anxious or aggressive?",
    a: "Our team is trained in low-stress handling techniques. We recommend starting with a simple bath and brush session to build trust. Let us know about any behavioral concerns when booking.",
  },
  {
    q: "Do you groom cats too?",
    a: "Absolutely! We provide gentle grooming services for both dogs and cats. Our feline guests receive extra care in a quiet, separate area to minimize stress.",
  },
  {
    q: "What is your cancellation policy?",
    a: "We request 24 hours notice for cancellations. Late cancellations may forfeit the booking fee. We understand emergencies happen — just give us a call.",
  },
] as const;

export const blogPosts = [
  {
    title: "5 Signs Your Pet Needs a Grooming Session",
    excerpt: "From excessive shedding to visible mats, learn the tell-tale signs that your furry friend is due for a professional grooming session.",
    date: "2026-06-15",
    category: "Pet Care Tips",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "The Importance of Dental Hygiene for Pets",
    excerpt: "Regular dental care isn't just about fresh breath. Discover how professional teeth cleaning can prevent serious health issues in your pet.",
    date: "2026-05-28",
    category: "Health & Wellness",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "Breed-Specific Grooming: A Complete Guide",
    excerpt: "Different breeds have different grooming needs. Our guide covers everything from Poodle clips to Labradoodle maintenance.",
    date: "2026-05-10",
    category: "Grooming Guide",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&auto=format&fit=crop&q=60",
  },
] as const;

// ========== CMS-DRIVEN SECTION DEFAULTS ==========

export const socialProof: SocialProofContent = {
  stats: [
    { value: 500, suffix: "+", label: "Pets Groomed" },
    { value: 8, suffix: "+", label: "Years Experience" },
    { value: 98, suffix: "%", label: "Happy Clients" },
    { value: 4.4, suffix: "\u2605", label: "Avg. Rating" },
  ],
};

export const gallery: GalleryContent = {
  heading: "Pet Gallery",
  subtitle:
    "A glimpse into the love and care we pour into every grooming session.",
  images: [
    {
      url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=60",
      alt: "Happy dog after grooming",
    },
    {
      url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&auto=format&fit=crop&q=60",
      alt: "Dog getting haircut",
    },
    {
      url: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?w=600&auto=format&fit=crop&q=60",
      alt: "Puppy in bath",
    },
    {
      url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=60",
      alt: "Dog with bow tie",
    },
    {
      url: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&auto=format&fit=crop&q=60",
      alt: "Happy puppy",
    },
    {
      url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=60",
      alt: "Dog smiling",
    },
    {
      url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60",
      alt: "Dog dental care",
    },
    {
      url: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&auto=format&fit=crop&q=60",
      alt: "Dog brush",
    },
  ],
};

export const team: TeamContent = {
  heading: "Meet Our Team",
  subtitle:
    "Passionate professionals dedicated to your pet's happiness and well-being.",
  members: [...teamMembers],
};

export const process: ProcessContent = {
  heading: "How It Works",
  subtitle:
    "Getting your pet the grooming they deserve is as easy as one-two-three.",
  steps: [...processSteps],
};

export const faq: FaqContent = {
  heading: "Frequently Asked Questions",
  subtitle:
    "Everything you need to know before your visit. Still have questions? Give us a call!",
  items: [...faqItems],
};

export const blog: BlogContent = {
  heading: "Tips & Articles",
  subtitle:
    "Expert advice and insights to keep your pet happy, healthy, and looking their best.",
  posts: [...blogPosts],
};

export const store: StoreContent = {
  heading: "Pet Store",
  subtitle:
    "Coats, shampoos and wellness essentials for your furry friend \u2014 call to order and we'll have it ready for pickup.",
  highlights: [
    { emoji: "🛁", label: "Coats & Shampoos" },
    { emoji: "✨", label: "Wellness Essentials" },
    { emoji: "🎾", label: "Play & Treats" },
  ],
};

/**
 * Admin-editable store catalog (jsonb CMS section `store_catalog`).
 * Display-only — every card links to "Call to order" (tel:STORE_PHONE).
 * Products use cinematic placeholder photos (Unsplash-style); the emoji
 * stays available as a fallback in the UI when image is empty.
 */
export const storeCatalog: StoreCatalogContent = {
  heading: "Pet Store",
  subtitle:
    "Display-only catalog \u2014 call to order, we'll have it ready.",
  categories: [
    { id: "clothes", name: "Clothes", emoji: "🧥" },
    { id: "products", name: "Wellness & Medicines", emoji: "🧴" },
  ],
  products: [
    {
      id: "cozy-winter-jacket",
      name: "Cozy Winter Jacket",
      category: "clothes",
      price: "TBD",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
      badge: "New",
    },
    {
      id: "rain-coat",
      name: "Rain Coat",
      category: "clothes",
      price: "TBD",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "hypoallergenic-shampoo",
      name: "Hypoallergenic Shampoo",
      category: "products",
      price: "TBD",
      image:
        "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
      badge: "Vet recommended",
    },
    {
      id: "tick-flea-spray",
      name: "Tick & Flea Spray",
      category: "products",
      price: "TBD",
      image:
        "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80",
    },
  ],
};

/**
 * Opening hours → 2-hour online booking slots (D11).
 * Keyed by JS getDay(): 0 = Sunday, 1 = Monday, ... 6 = Saturday.
 * Slots are precomputed so they can be unit-tested against the plan table (3.1).
 */
export const OPENING_HOURS: Record<
  number,
  { label: string; windows: [string, string][]; slots: string[]; note?: string }
> = {
  0: { label: "Sunday", windows: [], slots: [], note: "Open by consideration — call us" },
  1: {
    label: "Monday",
    windows: [["09:00", "11:00"], ["14:00", "19:00"]],
    slots: ["09:00", "14:00", "16:00"],
  },
  2: {
    label: "Tuesday",
    windows: [["09:00", "11:00"], ["14:00", "19:00"]],
    slots: ["09:00", "14:00", "16:00"],
  },
  3: {
    label: "Wednesday",
    windows: [["09:00", "13:00"]],
    slots: ["09:00", "11:00"],
  },
  4: {
    label: "Thursday",
    windows: [["09:00", "11:00"], ["14:00", "19:00"]],
    slots: ["09:00", "14:00", "16:00"],
  },
  5: {
    label: "Friday",
    windows: [["09:00", "11:00"], ["14:00", "19:00"]],
    slots: ["09:00", "14:00", "16:00"],
  },
  6: {
    label: "Saturday",
    windows: [["13:00", "17:00"]],
    slots: ["13:00", "15:00"],
  },
};

/**
 * Price shape per plan 3.2 / D9:
 * - `cat` is a species tier (not a weight category)
 * - `medium` is OPTIONAL — when absent, the modal falls back to the `small` bracket (D9)
 */
export type Prices = {
  cat?: number;
  small: number;
  medium?: number;
  large: number;
  xlarge: number;
} | { flat: number };

export const PRICING_MENU = {
  rules: `Booking by appointment only. A ${RUPEESIGN}500 booking fee is required (adjusted in your final bill).`,
  basicServices: [
    {
      id: "bath-brush-drying",
      label: "Bath + Brush + Drying",
      // no medium key → medium dogs billed at the small bracket (D9)
      prices: { cat: 1600, small: 1800, large: 2200, xlarge: 2600 },
    },
    {
      id: "haircut-styling",
      label: "Haircut / Styling Only",
      prices: { cat: 1000, small: 1500, medium: 2000, large: 2500, xlarge: 3000 },
    },
  ],
  completePackages: [
    {
      id: "full-groom",
      label: "Full Groom (Bath + Haircut + Nails + Ears)",
      // no medium key → medium dogs billed at the small bracket (D9)
      prices: { cat: 2000, small: 2500, large: 3000, xlarge: 3800 },
    },
    {
      id: "full-spa",
      label: "Spa Package (Keratin/Detox; massage optional same price)",
      // no medium key → medium dogs billed at the small bracket (D9)
      prices: { cat: 2500, small: 2900, large: 3500, xlarge: 4000 },
    },
  ],
  addOnServices: [
    { id: "nail-trim-ear-cleaning", label: "Nail Trim + Ear Cleaning", flat: 500 },
    { id: "teeth-cleaning", label: "Teeth Cleaning", flat: 400 },
    {
      id: "deshedding",
      label: "De-shedding Treatment",
      prices: { cat: 500, small: 600, medium: 600, large: 600, xlarge: 600 },
    },
    {
      id: "flea-tick",
      label: "Flea & Tick Removal Treatment",
      prices: { cat: 400, small: 500, medium: 500, large: 500, xlarge: 500 },
    },
  ],
  boardingRates: {
    label: "Boarding (per day)",
    note: "Discount on grooming prices given for boarding pets only.",
    cta: "Call to book",
    phone: "8798897732",
    rates: { small: 600, medium: 650, large: 700, xlarge: 750 },
  },
  weightCategories: {
    small: { label: "Small (Up to 10kg)", maxKg: 10 },
    medium: { label: "Medium (10-20kg)", maxKg: 20 },
    large: { label: "Large (20-35kg)", maxKg: 35 },
    xlarge: { label: "Extra Large (Above 35kg)", maxKg: Infinity },
  },
} as const;
