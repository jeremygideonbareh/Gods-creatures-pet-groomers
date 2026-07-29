import { useSiteContent } from "@/context/SiteContentContext";

const BASE = import.meta.env.BASE_URL;

export function ImageAutoSlider() {
  const { content } = useSiteContent();
  const images = content.reviews.images.map((img) => `${BASE}${img}`);
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center py-4">
      <div
        className="w-full"
        style={{
          mask: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMask: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
        <div
          className="flex gap-4 md:gap-5 w-max animate-marquee"
          style={{ "--duration": "25s" } as React.CSSProperties}
        >
          {duplicatedImages.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              <img
                src={src}
                alt={`Review ${(i % images.length) + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageAutoSlider;
