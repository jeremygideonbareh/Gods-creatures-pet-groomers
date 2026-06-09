import { whyChooseUs, pageBackgrounds, designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

export function WhyChooseUsSection() {
  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="relative w-full md:w-1/2 h-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${pageBackgrounds.whyChooseUs})`,
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-6 md:p-8">
          <h2 className="text-xl md:text-3xl uppercase mb-3 md:mb-4 text-center font-bold drop-shadow-lg">
            {whyChooseUs.heading}
          </h2>
          <div className="w-full max-w-md">
            <div className="flex flex-col gap-3 w-full mt-2">
              {whyChooseUs.cards.map((card, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div
                    className="min-w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: BRAND_PINK }}
                  >
                    <span className="text-lg">{card.icon}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
                      {card.title}
                    </h3>
                    <p className="text-white/80 text-xs mt-0.5">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUsSection;
