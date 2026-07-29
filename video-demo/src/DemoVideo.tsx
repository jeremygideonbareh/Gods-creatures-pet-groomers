import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  spring,
  Sequence,
} from "remotion";
import { images } from "./images";

const slides = [
  { key: "hero", label: "Gods Creatures Pet Groomers", sub: "Luxury grooming in Malki, Shillong" },
  { key: "why-choose-us", label: "Why Choose Us", sub: "4 reasons to trust us with your pet" },
  { key: "services", label: "Services", sub: "Full grooming, spa & styling packages" },
  { key: "reviews", label: "Reviews", sub: "What our happy clients say" },
  { key: "booking", label: "Book Now", sub: "Schedule your appointment today" },
];

const SLIDE_LEN = 90;
const OVERLAP = 15;

function Slide({ image, label, sub }: { image: string; label: string; sub: string }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, OVERLAP, SLIDE_LEN - OVERLAP, SLIDE_LEN], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(frame, [0, SLIDE_LEN], [1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, OVERLAP + 5], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(transparent 50%, rgba(0,0,0,0.7))" }} />
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 80px 100px" }}>
        <div style={{ transform: `translateY(${titleY}px)` }}>
          <h1 style={{ fontSize: 64, fontWeight: 700, color: "white", margin: 0, textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            {label}
          </h1>
          <p style={{ fontSize: 24, color: "rgba(255,255,255,0.85)", margin: "10px 0 0", textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
            {sub}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export const DemoVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const openSpring = spring({ frame, fps: 30, config: { damping: 10, stiffness: 80 } });
  const openScale = interpolate(frame, [0, 25], [1.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const openOpacity = interpolate(frame, [0, 15, 40, 45], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const closeOpacity = interpolate(frame, [405, 420, 440, 450], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closeY = interpolate(frame, [405, 425], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#d0999a", fontFamily: "Quicksand, system-ui, sans-serif" }}>
      {frame < 45 && (
        <AbsoluteFill style={{ opacity: openOpacity, justifyContent: "center", alignItems: "center", transform: `scale(${openScale})` }}>
          <div style={{ textAlign: "center", color: "white" }}>
            <h1 style={{ fontSize: 80, fontWeight: 700, margin: 0, opacity: openSpring }}>Gods Creatures</h1>
            <p style={{ fontSize: 22, marginTop: 14, opacity: openSpring * 0.8, textTransform: "uppercase", letterSpacing: 5 }}>Pet Groomers</p>
          </div>
        </AbsoluteFill>
      )}

      {slides.map((s, i) => {
        const from = 45 + i * (SLIDE_LEN - OVERLAP);
        return (
          <Sequence key={s.key} from={from} durationInFrames={SLIDE_LEN}>
            <Slide image={images[s.key]} label={s.label} sub={s.sub} />
          </Sequence>
        );
      })}

      {frame >= 405 && (
        <AbsoluteFill style={{ opacity: closeOpacity, justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
          <div style={{ textAlign: "center", color: "white", transform: `translateY(${closeY}px)` }}>
            <p style={{ fontSize: 14, opacity: 0.5, letterSpacing: 3, textTransform: "uppercase" }}>Visit us at</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: "8px 0" }}>gods-creatures-pet-groomers.pages.dev</h2>
            <p style={{ fontSize: 16, opacity: 0.6 }}>Malki, Nongshiliang, Shillong</p>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
