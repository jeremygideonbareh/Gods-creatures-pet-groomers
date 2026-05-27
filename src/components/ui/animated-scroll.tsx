import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import FeatureCarousel from "@/components/ui/feature-carousel";
import ImageAutoSlider from "@/components/ui/image-auto-slider";
import BookingModal from "@/components/ui/booking-modal";

interface PageContent {
  heading: string;
  description: string | React.ReactNode;
}

interface Page {
  leftBgImage: string | null;
  leftVideo?: string;
  rightBgImage: string | null;
  leftContent: PageContent | null;
  rightContent: PageContent | null;
}

const BRAND_PINK = "#d0999a";
const BASE = import.meta.env.BASE_URL;

const pages: Page[] = [
  {
    leftBgImage: null,
    leftVideo: `${BASE}herosectionvideo.mp4`,
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: "Gods Creatures Pet Groomers",
      description:
        "Luxury grooming by experienced professionals — only the finest for your pet.",
    },
  },
  {
    leftBgImage:
      "https://images.unsplash.com/photo-1544568100-847a948585b9?w=900&auto=format&fit=crop&q=60",
    rightBgImage: null,
    leftContent: {
      heading: "Why Choose Us",
      description: (
        <div className="flex flex-col gap-3 w-full mt-2">
          <div className="flex items-start gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="min-w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: BRAND_PINK }}>
              <span className="text-lg">🩺</span>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Vet-Backed Wellness</h3>
              <p className="text-white/80 text-xs mt-0.5">Years of veterinary partnership ensuring every pet receives the highest standard of preventive care.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="min-w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: BRAND_PINK }}>
              <span className="text-lg">🧴</span>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Luxury Spa Grooming</h3>
              <p className="text-white/80 text-xs mt-0.5">Premium imported products and gentle techniques by trained professionals who treat every pet like royalty.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="min-w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: BRAND_PINK }}>
              <span className="text-lg">🕐</span>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Years of Expertise</h3>
              <p className="text-white/80 text-xs mt-0.5">Decades of combined experience — our well-trained team brings mastery and passion to every appointment.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="min-w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: BRAND_PINK }}>
              <span className="text-lg">✨</span>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide">Luxury Imported Products</h3>
              <p className="text-white/80 text-xs mt-0.5">Premium shampoos, conditioners &amp; treatments sourced from around the world for that extra touch of indulgence.</p>
            </div>
          </div>
        </div>
      ),
    },
    rightContent: null,
  },
  {
    leftBgImage:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=900&auto=format&fit=crop&q=60",
    rightBgImage: null,
    leftContent: {
      heading: "Our Signature Services",
      description: "Expertly crafted grooming experiences using only the finest imported products by our seasoned professionals.",
    },
    rightContent: null,
  },
  {
    leftBgImage:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&auto=format&fit=crop&q=60",
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: "Happy Clients",
      description: (
        <div className="flex flex-col gap-4 mt-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/20 text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm">🐕</div>
              <div>
                <p className="text-white font-semibold text-xs">Bruno's Mom</p>
                <p className="text-white/60 text-[10px]">Regular since 2023</p>
              </div>
            </div>
            <p className="text-white/90 text-sm italic">"The grooming transformed my anxious rescue into a fluffy star. He actually pulls me toward the salon now!"</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/20 text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm">🐩</div>
              <div>
                <p className="text-white font-semibold text-xs">Coco's Dad</p>
                <p className="text-white/60 text-[10px]">Grooming + Wellness</p>
              </div>
            </div>
            <p className="text-white/90 text-sm italic">"The dental hygiene program saved us a fortune in vet bills. Plus Coco smells amazing for weeks!"</p>
          </div>
        </div>
      ),
    },
  },
  {
    leftBgImage:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&auto=format&fit=crop&q=60",
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: "Book Now",
      description: (
        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/20 text-left w-full">
            <p className="text-white/80 text-sm flex items-center gap-2">
              <span>📍</span> Malki, Shillong
            </p>
            <p className="text-white/80 text-sm flex items-center gap-2 mt-2">
              <span>🕐</span> Mon–Sat 8am–4pm | Sunday closed
            </p>
            <p className="text-white/80 text-sm flex items-center gap-2 mt-2">
              <span>📞</span> Call us to book your slot!
            </p>
          </div>
          <a
            href="#"
            className="liquid-glass inline-block px-10 py-4 rounded-full text-white font-semibold text-lg uppercase tracking-wider transition-transform hover:scale-105"
          >
            🐾 Book a Session
          </a>
          <p className="text-white/60 text-xs">Walk-ins possible? Just give us a ring!</p>
        </div>
      ),
    },
  },
];

export default function ScrollAdventure() {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingOpen, setBookingOpen] = useState(false);
  const numOfPages = pages.length;
  const animTime = 1000;
  const scrolling = useRef(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const navigateUp = useCallback(() => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  }, [currentPage]);

  const navigateDown = useCallback(() => {
    if (currentPage < numOfPages) setCurrentPage((p) => p + 1);
  }, [currentPage, numOfPages]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (scrolling.current) return;
      if (Math.abs(e.deltaY) < 50) return;
      scrolling.current = true;
      if (e.deltaY > 0) {
        navigateDown();
      } else {
        navigateUp();
      }
      setTimeout(() => (scrolling.current = false), animTime);
    },
    [navigateDown, navigateUp]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (scrolling.current) return;
      if (e.key === "ArrowUp") {
        scrolling.current = true;
        navigateUp();
        setTimeout(() => (scrolling.current = false), animTime);
      } else if (e.key === "ArrowDown") {
        scrolling.current = true;
        navigateDown();
        setTimeout(() => (scrolling.current = false), animTime);
      }
    },
    [navigateDown, navigateUp]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (scrolling.current) return;
      touchEndY.current = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY.current;
      if (Math.abs(diff) > 50) {
        scrolling.current = true;
        if (diff > 0) {
          navigateDown();
        } else {
          navigateUp();
        }
        setTimeout(() => (scrolling.current = false), animTime);
      }
    },
    [navigateDown, navigateUp]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleWheel, handleKeyDown, handleTouchStart, handleTouchEnd]);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (currentPage === 1) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [currentPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (scrolling.current || page === currentPage) return;
      scrolling.current = true;
      setCurrentPage(page);
      setTimeout(() => (scrolling.current = false), animTime);
    },
    [currentPage]
  );

  return (
    <div className="relative overflow-hidden h-screen bg-black select-none">
      <style>{`
        @keyframes liquidFlow {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
        .liquid-glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.28) 75%, rgba(255,255,255,0.08) 100%);
          background-size: 400% 400%;
          animation: liquidFlow 6s ease infinite;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 4px 24px rgba(255,255,255,0.08);
        }
        .liquid-glass:hover {
          border-color: rgba(255,255,255,0.5);
          box-shadow: 0 4px 32px rgba(255,255,255,0.15);
        }
      `}</style>
      {pages.map((page, i) => {
        const idx = i + 1;
        const isActive = currentPage === idx;
        const transY = isActive
          ? "translateY(0)"
          : idx < currentPage
          ? "translateY(-100%)"
          : "translateY(100%)";

        const hasLeft =
          page.leftBgImage !== null ||
          page.leftContent !== null ||
          page.leftVideo !== undefined;
        const hasRight =
          page.rightBgImage !== null ||
          page.rightContent !== null ||
          idx === 3;

        const mobileLeftH = !hasRight
          ? "h-full"
          : "h-[30%] md:h-full";
        const mobileRightH = !hasLeft
          ? "h-full"
          : "h-[70%] md:h-full";

        return (
          <div
            key={idx}
            className="absolute inset-0 transition-transform duration-[1000ms]"
            style={{ transform: transY }}
          >
            <div className="flex flex-col md:flex-row w-full h-full">
              {page.leftVideo ? (
                <div className="absolute inset-0">
                  <video
                    ref={(el) => { if (idx === 1) heroVideoRef.current = el; }}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={page.leftVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-8">
                    {page.rightContent?.heading && (
                      <h2 className="text-2xl md:text-5xl uppercase mb-4 text-center font-bold drop-shadow-lg max-w-2xl">
                        {page.rightContent.heading}
                      </h2>
                    )}
                    {page.rightContent &&
                      (typeof page.rightContent.description === "string" ? (
                        <p className="text-sm md:text-xl text-center max-w-lg drop-shadow-md">
                          {page.rightContent.description}
                        </p>
                      ) : (
                        <div className="w-full max-w-lg">
                          {page.rightContent.description}
                        </div>
                      ))}
                    <button
                      onClick={() => setBookingOpen(true)}
                      className="liquid-glass mt-6 md:mt-8 px-8 md:px-12 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg uppercase tracking-wider transition-transform hover:scale-105 text-white"
                    >
                      🐾 Book Appointment
                    </button>
                  </div>
                </div>
              ) : idx === 3 ? (
                <div className="absolute inset-0 overflow-y-auto bg-black">
                  <div className="flex items-center justify-center pt-4 md:pt-6 pb-1 md:pb-2">
                    <h2 className="text-lg md:text-3xl uppercase font-bold text-white drop-shadow-lg text-center px-4">
                      Our Signature Services
                    </h2>
                  </div>
                  <p className="text-white/70 text-xs md:hidden text-center px-4 pb-2 -mt-1">
                    Expertly crafted using the finest imported products.
                  </p>
                  <div className="w-full">
                    <FeatureCarousel />
                  </div>
                </div>
              ) : (
                <>
                  {/* Left Panel */}
                  {hasLeft && (
                    <div className={`relative w-full md:w-1/2 ${mobileLeftH} overflow-hidden`}>
                      {page.leftVideo ? (
                        <video
                          className="absolute inset-0 w-full h-full object-cover"
                          src={page.leftVideo}
                          autoPlay loop muted playsInline
                        />
                      ) : (
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: page.leftBgImage
                              ? `url(${page.leftBgImage})`
                              : undefined,
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-6 md:p-8">
                        {page.leftContent && (
                          <>
                            <h2 className="text-xl md:text-3xl uppercase mb-3 md:mb-4 text-center font-bold drop-shadow-lg">
                              {page.leftContent.heading}
                            </h2>
                            {typeof page.leftContent.description === "string" ? (
                              <p className="text-sm md:text-lg text-center max-w-md drop-shadow-md">
                                {page.leftContent.description}
                              </p>
                            ) : (
                              <div className="w-full max-w-md">
                                {page.leftContent.description}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Right Panel */}
                  {hasRight && (
                    <div className={`relative w-full md:w-1/2 ${mobileRightH} overflow-hidden`}>
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: page.rightBgImage
                            ? `url(${page.rightBgImage})`
                            : undefined,
                        }}
                      />
                      {!page.rightBgImage && (
                        <div className="absolute inset-0 bg-black/70" />
                      )}
                      {page.rightBgImage && (
                        <div className="absolute inset-0 bg-black/30" />
                      )}
                      {idx === 4 ? (
                        <div className="flex flex-col w-full h-full">
                          <div className="flex-[35%] flex flex-col items-center justify-center px-4 md:px-8 pt-4 md:pt-6 pb-2">
                            <h2 className="text-lg md:text-2xl uppercase mb-2 text-center font-bold drop-shadow-lg">
                              {page.rightContent?.heading}
                            </h2>
                            <div className="w-full max-w-md space-y-2">
                              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 text-left">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-sm">🐕</div>
                                  <div>
                                    <p className="text-white font-semibold text-xs">Bruno's Mom</p>
                                    <p className="text-white/60 text-[10px]">Regular since 2023</p>
                                  </div>
                                </div>
                                <p className="text-white/90 text-xs md:text-sm italic">"The level of care and expertise is unmatched. Bruno has never looked more luxurious — the imported products make such a difference!"</p>
                              </div>
                              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 text-left">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-sm">🐩</div>
                                  <div>
                                    <p className="text-white font-semibold text-xs">Coco's Dad</p>
                                    <p className="text-white/60 text-[10px]">Grooming + Wellness</p>
                                  </div>
                                </div>
                                <p className="text-white/90 text-xs md:text-sm italic">"The experienced team transformed Coco's coat completely. Years of expertise really show — we've never been happier!"</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex-[65%] overflow-hidden">
                            <ImageAutoSlider />
                          </div>
                        </div>
                      ) : idx === 3 ? (
                          <div className="w-full h-full overflow-y-auto py-2 md:py-4 px-0 md:px-2">
                            <div className="md:hidden text-center mb-2">
                              <h2 className="text-lg uppercase font-bold drop-shadow-lg">
                                Our Signature Services
                              </h2>
                              <p className="text-xs mt-0.5 opacity-80">
                                Expertly crafted using the finest imported products.
                              </p>
                            </div>
                            <FeatureCarousel />
                          </div>
                        ) : idx === 5 ? (
                          <div className="flex flex-col items-center justify-center h-full text-white px-6 md:px-8 py-6 md:py-8">
                            <h2 className="text-xl md:text-3xl uppercase mb-4 md:mb-6 text-center font-bold drop-shadow-lg">
                              {page.rightContent?.heading}
                            </h2>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 w-full max-w-sm">
                              <p className="text-white/90 text-sm flex items-center gap-2">
                                <span>📍</span> Malki, Shillong
                              </p>
                              <p className="text-white/90 text-sm flex items-center gap-2 mt-2">
                                <span>🕐</span> Mon–Sat 8am–4pm | Sunday closed
                              </p>
                              <p className="text-white/90 text-sm flex items-center gap-2 mt-2">
                                <span>📞</span> Call us to book your slot!
                              </p>
                            </div>
                            <button
                              onClick={() => setBookingOpen(true)}
                              className="mt-4 md:mt-6 px-8 md:px-10 py-3 md:py-4 rounded-full text-white font-semibold text-base md:text-lg uppercase tracking-wider transition-transform hover:scale-105"
                              style={{ backgroundColor: BRAND_PINK }}
                            >
                              🐾 Book a Session
                            </button>
                            <p className="text-white/60 text-xs mt-3">Walk-ins possible? Just give us a ring!</p>
                          </div>
                        ) : (
                          <>
                            {page.rightContent?.heading && (
                              <h2 className="text-xl md:text-3xl uppercase mb-3 md:mb-4 text-center font-bold drop-shadow-lg">
                                {page.rightContent.heading}
                              </h2>
                            )}
                            {page.rightContent &&
                              (typeof page.rightContent.description === "string" ? (
                                <p className="text-sm md:text-lg text-center max-w-md drop-shadow-md">
                                  {page.rightContent.description}
                                </p>
                              ) : (
                                <div className="w-full max-w-md">
                                  {page.rightContent.description}
                                </div>
                              ))}
                          </>
                        )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
      <div className="absolute bottom-6 right-6 z-50 flex gap-2">
        {currentPage > 1 && (
          <button
            onClick={() => goToPage(currentPage - 1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
            aria-label="Previous page"
          >
            <ChevronUp size={20} />
          </button>
        )}
        {currentPage < numOfPages && (
          <button
            onClick={() => goToPage(currentPage + 1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
            aria-label="Next page"
          >
            <ChevronDown size={20} />
          </button>
        )}
      </div>

      {/* Dot Navigation */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5">
        {pages.map((_, i) => {
          const idx = i + 1;
          const isActive = currentPage === idx;
          return (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "scale-150"
                  : "opacity-40 hover:opacity-70"
              }`}
              style={{
                backgroundColor: isActive ? BRAND_PINK : "white",
              }}
              aria-label={`Go to page ${idx}`}
            />
          );
        })}
      </div>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
