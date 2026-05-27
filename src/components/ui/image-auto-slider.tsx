"use client";

import { motion } from "motion/react";

const images = [
  "/review-image1.png",
  "/review-image2.png",
  "/review-image3.png",
  "/reviewimage5.jpeg",
];

const duplicatedImages = [...images, ...images];

export function ImageAutoSlider() {
  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          mask: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMask:
            "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <motion.div
          className="flex gap-4 md:gap-6 w-max"
          animate={{ x: "-50%" }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {duplicatedImages.map((src, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-xl overflow-hidden shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={src}
                alt={`Review ${(i % images.length) + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default ImageAutoSlider;
