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

// ========== NEW CONTENT SECTIONS ==========

export const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Head Groomer",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop&q=60",
    bio: "10+ years of professional grooming experience. Certified Master Groomer with a passion for creative styling.",
    emoji: "🐾",
  },
  {
    name: "Mike Chen",
    role: "Senior Groomer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
    bio: "Specializes in breed-specific cuts and gentle handling of anxious pets. Vet-backed wellness advocate.",
    emoji: "🩺",
  },
  {
    name: "Emily Rodriguez",
    role: "Pet Stylist",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
    bio: "Award-winning creative groomer. Turns every pet into a masterpiece with patience and premium products.",
    emoji: "✂️",
  },
  {
    name: "Dr. James Park",
    role: "Veterinary Consultant",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60",
    bio: "Partnership vet ensuring every grooming session meets the highest standards of pet health and safety.",
    emoji: "🩺",
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
