import ImageAutoSlider from "@/components/ui/image-auto-slider";
import { reviews, pageBackgrounds } from "@/config/site-content";

export function ReviewsSection() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <div className="relative w-full md:w-1/2 h-[30%] md:h-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${pageBackgrounds.reviews})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative w-full md:w-1/2 h-[70%] md:h-full overflow-hidden">
        <div className="flex flex-col w-full h-full">
          <div className="flex-[35%] flex flex-col items-center justify-center px-4 md:px-8 pt-4 md:pt-6 pb-2">
            <h2 className="text-lg md:text-2xl uppercase mb-2 text-center font-bold drop-shadow-lg">
              {reviews.heading}
            </h2>
            <div className="w-full max-w-md space-y-2">
              {reviews.testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 text-left"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-sm">
                      {t.emoji}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-xs">
                        {t.author}
                      </p>
                      <p className="text-white/60 text-[10px]">{t.tag}</p>
                    </div>
                  </div>
                  <p className="text-white/90 text-xs md:text-sm italic">
                    "{t.textLong}"
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-[65%] overflow-hidden">
            <ImageAutoSlider />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewsSection;
