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
  heading: "Why Choose Us",
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
  hours: "Mon–Sat 8am–4pm | Sunday closed",
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

export const PRICING_MENU = {
  rules: `Booking by appointment only. A ${RUPEESIGN}500 booking fee is required (adjusted in your final bill).`,
  basicServices: [
    {
      id: "bath-brush-nail-ear",
      label: "Bath + Brush + Nail Trim + Ear Cleaning",
      prices: { small: 1800, medium: 2100, large: 2400, xlarge: 2800 },
    },
    {
      id: "haircut-styling",
      label: "Haircut / Styling Only",
      prices: { small: 1200, medium: 1400, large: 1600, xlarge: 1800 },
    },
    {
      id: "nail-trim-ear-cleaning",
      label: "Nail Trim + Ear Cleaning Only",
      flat: 500,
    },
  ],
  completePackages: [
    {
      id: "full-groom",
      label: "Full Groom (Bath + Haircut + Nails + Ears)",
      prices: { small: 2500, medium: 2900, large: 3300, xlarge: 3800 },
    },
    {
      id: "full-spa",
      label: "Full Spa Package (Everything included)",
      prices: { small: 2900, medium: 3400, large: 3900, xlarge: 4500 },
    },
  ],
  addOnServices: [
    { id: "teeth-cleaning", label: "Teeth Cleaning", flat: 400 },
    { id: "flea-tick", label: "Flea & Tick Removal Treatment", flat: 500 },
    {
      id: "deshedding",
      label: "De-shedding Treatment",
      prices: { small: 500, medium: 600, large: 700, xlarge: 800 },
    },
    {
      id: "spa-massage",
      label: "Spa with Massage & Conditioning",
      prices: { small: 700, medium: 800, large: 900, xlarge: 1000 },
    },
  ],
  weightCategories: {
    small: { label: "Small (Up to 10kg)", maxKg: 10 },
    medium: { label: "Medium (10-20kg)", maxKg: 20 },
    large: { label: "Large (20-35kg)", maxKg: 35 },
    xlarge: { label: "Extra Large (Above 35kg)", maxKg: Infinity },
  },
} as const;
