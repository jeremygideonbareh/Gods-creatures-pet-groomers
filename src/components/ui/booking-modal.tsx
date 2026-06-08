"use client";

import { useState, useEffect, useRef } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $customer_name: String!
    $email: String!
    $phone: String!
    $service: String!
    $preferred_date: String!
    $notes: String!
    $advance_paid: numeric!
    $transaction_id: String!
  ) {
    insert_bookings_one(
      object: {
        customer_name: $customer_name
        email: $email
        phone: $phone
        service: $service
        preferred_date: $preferred_date
        notes: $notes
        advance_paid: $advance_paid
        transaction_id: $transaction_id
      }
    ) {
      id
      customer_name
    }
  }
`;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BRAND_PINK = "#d0999a";

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"info" | "form">("info");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const transactionIdRef = useRef<HTMLInputElement>(null);

  const [createBooking] = useMutation(CREATE_BOOKING);

  useEffect(() => {
    if (!isOpen) {
      setStep("info");
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const transactionId = transactionIdRef.current?.value.trim();
    if (!transactionId) {
      setErrorMessage("Please enter the UPI Transaction ID to confirm your ₹500 advance payment.");
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("loading");

    try {
      const result = await createBooking({
        variables: {
          customer_name: nameRef.current?.value || "",
          email: emailRef.current?.value || "",
          phone: phoneRef.current?.value || "",
          service: serviceRef.current?.value || "",
          preferred_date: dateRef.current?.value || "",
          notes: notesRef.current?.value || "",
          advance_paid: 500,
          transaction_id: transactionId,
        },
      });

      if (result.error) {
        const msg = result.error.message.toLowerCase();
        if (
          msg.includes("unique constraint") ||
          msg.includes("unique_transaction_id")
        ) {
          setErrorMessage(
            "This UPI Reference Number has already been used. Please check your details or contact support.",
          );
        } else {
          setErrorMessage("Unable to process booking. Please try again.");
        }
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message.toLowerCase() : "";
      if (
        msg.includes("unique constraint") ||
        msg.includes("unique_transaction_id")
      ) {
        setErrorMessage(
          "This UPI Reference Number has already been used. Please check your details or contact support.",
        );
      } else {
        setErrorMessage("Unable to process booking. Please try again.");
      }
      setSubmitStatus("error");
    }
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

            {submitStatus === "success" ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-4">🎉</p>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Woohoo!
                </h2>
                <p className="text-white/80">
                  Your request has been sent. We'll get back to you with a confirmed slot!
                </p>
              </div>
            ) : step === "info" ? (
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
                    ref={nameRef}
                    type="text"
                    placeholder="Your name *"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email address *"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                  <input
                    ref={phoneRef}
                    type="tel"
                    placeholder="Phone number"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                  <select
                    ref={serviceRef}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white outline-none focus:border-white/60"
                  >
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
                    ref={dateRef}
                    type="text"
                    placeholder="Preferred date (e.g., Monday 10am)"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                  <textarea
                    ref={notesRef}
                    rows={2}
                    placeholder="Tell us about your pet (breed, special notes...)"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 resize-none"
                  />
                  <div className="bg-white/15 rounded-xl p-3 space-y-2">
                    <p className="text-white font-semibold text-sm">
                      💳 Advance Payment (₹500)
                    </p>
                    <p className="text-white/60 text-xs">
                      A ₹500 advance is required to secure your grooming slot. Pay via UPI and enter the reference below.
                    </p>
                    <input
                      ref={transactionIdRef}
                      type="text"
                      placeholder="UPI Reference No. / Transaction ID *"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                    />
                  </div>
                  {submitStatus === "error" && (
                    <p className="text-red-200 text-sm text-center bg-red-500/20 rounded-lg p-2">
                      {errorMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitStatus === "loading"}
                    className="w-full py-3 rounded-full bg-white font-semibold text-lg transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ color: BRAND_PINK }}
                  >
                    {submitStatus === "loading"
                      ? "⏳ Sending..."
                      : "✉️ send request"}
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
