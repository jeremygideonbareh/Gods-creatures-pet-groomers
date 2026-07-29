import { designTokens } from "@/config/site-content";
import { useSiteContent } from "@/context/SiteContentContext";
import { PawPrint, MapPin, Clock, Phone, MessageCircle } from "lucide-react";

const BRAND_PINK = designTokens.brandPink;
const BRAND_CHARCOAL = designTokens.brandCharcoal;

export function EnhancedFooter() {
  const { content } = useSiteContent();
  const booking = content.booking;

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: BRAND_CHARCOAL }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND_PINK}, #e8b4b5, ${BRAND_PINK}, transparent)`,
        }}
      />

      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: BRAND_PINK }}
              >
                <PawPrint size={20} className="text-white" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">
                Gods Creatures
              </h3>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Luxury pet grooming salon in Malki, Shillong — where every tail wags brighter.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: MessageCircle, href: "#", label: "Instagram" },
                { icon: MessageCircle, href: "#", label: "Facebook" },
                { icon: MessageCircle, href: "#", label: "WhatsApp" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: `${BRAND_PINK}20` }}
                  aria-label={social.label}
                >
                  <social.icon size={16} className="text-white/70 hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Services", "Gallery", "Testimonials", "Book Now", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-white/50 text-sm hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {[
                "Luxury Bath & Blow-dry",
                "Stylish Haircut",
                "Dental Hygiene",
                "Pawdicure",
                "Full Groom Package",
              ].map((service) => (
                <li key={service}>
                  <span className="text-white/50 text-sm hover:text-white transition-colors duration-300 cursor-pointer inline-block">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: BRAND_PINK }} />
                <span>{booking.location}</span>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <Clock size={14} className="mt-0.5 shrink-0" style={{ color: BRAND_PINK }} />
                <span>{booking.hours}</span>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <Phone size={14} className="mt-0.5 shrink-0" style={{ color: BRAND_PINK }} />
                <span>{booking.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              &copy; {new Date().getFullYear()} Gods Creatures Pet Groomers. All rights reserved.
            </p>
            <p className="text-white/20 text-[10px]">
              Malki, Nongshiliang, Shillong, Meghalaya
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default EnhancedFooter;
