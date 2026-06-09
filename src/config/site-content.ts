export const adminEmail = "cloudlyconfusing@gmail.com";

export const designTokens = {
  brandPink: "#d0999a",
  darkPink: "#c48a8b",
} as const;

export const hero = {
  title: "Gods Creatures Pet Groomers",
  subtitle:
    "Luxury grooming by experienced professionals — only the finest for your pet.",
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
        "Decades of combined experience — our well-trained team brings mastery and passion to every appointment.",
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
        "Precision styling by experienced groomers who understand every breed's unique beauty — using professional-grade tools for a flawless finish.",
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
        'The level of care and expertise is unmatched. Bruno has never looked more luxurious — the imported products make such a difference!',
    },
    {
      emoji: "🐩",
      author: "Coco's Dad",
      tag: "Grooming + Wellness",
      text: 'The dental hygiene program saved us a fortune in vet bills. Plus Coco smells amazing for weeks!',
      textLong:
        "The experienced team transformed Coco's coat completely. Years of expertise really show — we've never been happier!",
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
  location: "Malki, Shillong",
  hours: "Mon–Sat 8am–4pm | Sunday closed",
  phone: "Call us to book your slot!",
  cta: "Book a Session",
  subtitle: "Walk-ins possible? Just give us a ring!",
  ctaIcon: "🐾",
  locationIcon: "📍",
  hoursIcon: "🕐",
  phoneIcon: "📞",
  modalTitle: "Book a Session",
  modalSubtitle: "Secure your spot — we'll take care of the rest!",
  bookingFeeLabel: "₹500 booking fee",
  bookingFeeDetail:
    "Paid at time of service. Covers grooming essentials & wellness check.",
  proceedCta: "Proceed to Schedule",
  questionsCta: "Questions? Call us directly!",
  formTitle: "Book a Session",
  formSubtitle: "Fill in the details and we'll get back to you!",
  advancePaymentTitle: "Advance Payment (₹500)",
  advancePaymentDetail:
    "A ₹500 advance is required to secure your grooming slot. Pay via UPI and enter the reference below.",
  upiTooltip:
    "Find the 12-digit UPI Ref Number (UTR) in your GPay/PhonePe history.",
  upiPlaceholder: "UPI Reference No. / Transaction ID *",
  submitLabel: "send request",
  submittingLabel: "Sending...",
  successEmoji: "🎉",
  successTitle: "Woohoo!",
  successMessage:
    "Your request has been sent. We'll get back to you with a confirmed slot!",
} as const;
