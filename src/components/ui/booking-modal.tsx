"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BRAND_PINK = "#d0999a";

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"info" | "form">("info");

  useEffect(() => {
    if (!isOpen) setStep("info");
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "🎉 Woohoo! Your request has been sent. We'll get back to you with sweet treats and a confirmed slot! 🐾"
    );
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg rounded-3xl p-8 border border-white/20"
            style={{ backgroundColor: BRAND_PINK }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {step === "info" ? (
              <>
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  🐾 Book a Session
                </h2>
                <p className="text-white/80 text-center mb-6">
                  Secure your spot — we'll take care of the rest!
                </p>
                <div className="bg-white/20 rounded-xl p-4 mb-6 text-center">
                  <p className="text-white font-semibold">
                    ₹500 booking fee
                  </p>
                  <p className="text-white/70 text-sm">
                    Paid at time of service. Covers grooming essentials &amp; wellness check.
                  </p>
                </div>
                <button
                  onClick={() => setStep("form")}
                  className="w-full py-3 rounded-full bg-white font-semibold text-lg transition-transform hover:scale-[1.02]"
                  style={{ color: BRAND_PINK }}
                >
                  📅 Proceed to Schedule
                </button>
                <p className="text-white/60 text-xs text-center mt-4">
                  Questions? Call us directly!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  🐾 Book a Session
                </h2>
                <p className="text-white/80 text-center mb-4">
                  Fill in the details and we'll get back to you!
                </p>
                <div className="bg-white/20 rounded-xl p-3 mb-4 text-center">
                  <p className="text-white text-sm">
                    ₹500 booking fee{" "}
                    <span className="text-white/70">
                      — Paid at time of service.
                    </span>
                  </p>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your name *"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                  <input
                    type="email"
                    placeholder="Email address *"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                  <select className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white outline-none focus:border-white/60">
                    <option className="bg-[#d0999a] text-white">
                      Select service
                    </option>
                    <option className="bg-[#d0999a] text-white">
                      Luxury Grooming
                    </option>
                    <option className="bg-[#d0999a] text-white">
                      Wellness Check + Vet Advice
                    </option>
                    <option className="bg-[#d0999a] text-white">
                      Spa &amp; Dental package
                    </option>
                    <option className="bg-[#d0999a] text-white">
                      Just a nail trim / paw care
                    </option>
                  </select>
                  <input
                    type="text"
                    placeholder="Preferred date (e.g., Monday 10am)"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                  <textarea
                    rows={2}
                    placeholder="Tell us about your pet (breed, special notes...)"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-white font-semibold text-lg transition-transform hover:scale-[1.02]"
                    style={{ color: BRAND_PINK }}
                  >
                    ✉️ send request
                  </button>
                </form>
                <p className="text-white/60 text-xs text-center mt-3">
                  We'll contact you to confirm your slot!
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BookingModal;
