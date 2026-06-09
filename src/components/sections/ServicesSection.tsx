import FeatureCarousel from "@/components/ui/feature-carousel";
import { services } from "@/config/site-content";

export function ServicesSection() {
  return (
    <div className="absolute inset-0 overflow-y-auto bg-black">
      <div className="flex items-center justify-center pt-4 md:pt-6 pb-1 md:pb-2">
        <h2 className="text-lg md:text-3xl uppercase font-bold text-white drop-shadow-lg text-center px-4">
          {services.heading}
        </h2>
      </div>
      <p className="text-white/70 text-xs md:hidden text-center px-4 pb-2 -mt-1">
        {services.subtitle}
      </p>
      <div className="w-full">
        <FeatureCarousel />
      </div>
    </div>
  );
}

export default ServicesSection;
