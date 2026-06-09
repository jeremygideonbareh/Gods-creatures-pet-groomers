import { useState, useEffect, useRef, useCallback } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { designTokens } from "@/config/site-content";
import { useSiteContent } from "@/context/SiteContentContext";
import { useAuth } from "@/context/AuthContext";
import { GET_USER_PETS } from "@/lib/graphql";

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
    $pet_id: Int
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
        pet_id: $pet_id
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

const BRAND_PINK = designTokens.brandPink;

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 28,
  mass: 0.8,
};

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
];

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE.join(",")));
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"info" | "form">("info");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const transactionIdRef = useRef<HTMLInputElement>(null);
  const petRef = useRef<HTMLSelectElement>(null);

  const { user } = useAuth();
  const { content } = useSiteContent();
  const booking = content.booking;
  const { data: petData } = useQuery<{ pets: { id: number; name: string; species: string; breed: string | null }[] }>(GET_USER_PETS, { skip: !user });
  const pets = petData?.pets || [];

  const [createBooking] = useMutation(CREATE_BOOKING);

  useEffect(() => {
    if (!isOpen) {
      setStep("info");
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && submitStatus !== "loading") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, submitStatus]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = getFocusableElements(modalRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const email = emailRef.current?.value.trim() || "";
    const phone = phoneRef.current?.value.trim() || "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setSubmitStatus("error");
      return;
    }

    if (phone && !/^\+?\d{7,15}$/.test(phone.replace(/[\s-]/g, ""))) {
      setErrorMessage("Please enter a valid phone number (7-15 digits).");
      setSubmitStatus("error");
      return;
    }

    const transactionId = transactionIdRef.current?.value.trim();
    if (!transactionId) {
      setErrorMessage(
        "Please enter the UPI Transaction ID to confirm your ₹500 advance payment."
      );
      setSubmitStatus("error");
      return;
    }

    const selectedPetId = petRef.current?.value ? parseInt(petRef.current.value, 10) : null;

    setSubmitStatus("loading");

    try {
      const result = await createBooking({
        variables: {
          customer_name: nameRef.current?.value || "",
          email,
          phone,
          service: serviceRef.current?.value || "",
          preferred_date: dateRef.current?.value || "",
          notes: notesRef.current?.value || "",
          advance_paid: 500,
          transaction_id: transactionId,
          pet_id: selectedPetId,
        },
      });

      if (result.error) {
        const msg = result.error.message.toLowerCase();
        if (
          msg.includes("unique constraint") ||
          msg.includes("unique_transaction_id")
        ) {
          setErrorMessage(
            "This UPI Reference Number has already been used. Please check your details or contact support."
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
          "This UPI Reference Number has already been used. Please check your details or contact support."
        );
      } else {
        setErrorMessage("Unable to process booking. Please try again.");
      }
      setSubmitStatus("error");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && submitStatus !== "loading") onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={springTransition}
            onKeyDown={handleKeyDown}
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

            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={springTransition}
                  className="text-center py-8"
                  aria-live="polite"
                >
                  <p className="text-4xl mb-4">
                    {booking.successEmoji}
                  </p>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {booking.successTitle}
                  </h2>
                  <p className="text-white/80">
                    {booking.successMessage}
                  </p>
                </motion.div>
              ) : step === "info" ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={springTransition}
                >
                  <h2 className="text-2xl font-bold text-white text-center mb-2">
                    🐾 {booking.modalTitle}
                  </h2>
                  <p className="text-white/80 text-center mb-6">
                    {booking.modalSubtitle}
                  </p>
                  <div className="bg-white/20 rounded-xl p-4 mb-6 text-center">
                    <p className="text-white font-semibold">
                      {booking.bookingFeeLabel}
                    </p>
                    <p className="text-white/70 text-sm">
                      {booking.bookingFeeDetail}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep("form")}
                    className="w-full py-3 rounded-full bg-white font-semibold text-lg transition-transform hover:scale-[1.02]"
                    style={{ color: BRAND_PINK }}
                  >
                    📅 {booking.proceedCta}
                  </button>
                  <p className="text-white/60 text-xs text-center mt-4">
                    {booking.questionsCta}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={springTransition}
                >
                  <h2 className="text-2xl font-bold text-white text-center mb-2">
                    🐾 {booking.formTitle}
                  </h2>
                  <p className="text-white/80 text-center mb-4">
                    {booking.formSubtitle}
                  </p>
                  <div className="bg-white/20 rounded-xl p-3 mb-4 text-center">
                    <p className="text-white text-sm">
                      {booking.bookingFeeLabel}{" "}
                      <span className="text-white/70">
                        — {booking.bookingFeeDetail.toLowerCase()}
                      </span>
                    </p>
                  </div>
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div>
                      <label htmlFor="booking-name" className="sr-only">
                        Your name
                      </label>
                      <input
                        id="booking-name"
                        ref={nameRef}
                        type="text"
                        placeholder="Your name *"
                        required
                        maxLength={100}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="booking-email"
                        ref={emailRef}
                        type="email"
                        placeholder="Email address *"
                        required
                        maxLength={255}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-phone" className="sr-only">
                        Phone number
                      </label>
                      <input
                        id="booking-phone"
                        ref={phoneRef}
                        type="tel"
                        placeholder="Phone number"
                        maxLength={15}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-service" className="sr-only">
                        Select service
                      </label>
                      <select
                        id="booking-service"
                        ref={serviceRef}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white outline-none focus:border-white/60"
                      >
                        <option value="" className="bg-[#d0999a] text-white">
                          Select service
                        </option>
                        <option
                          value="luxury-grooming"
                          className="bg-[#d0999a] text-white"
                        >
                          Luxury Grooming
                        </option>
                        <option
                          value="wellness-check"
                          className="bg-[#d0999a] text-white"
                        >
                          Wellness Check + Vet Advice
                        </option>
                        <option
                          value="spa-dental"
                          className="bg-[#d0999a] text-white"
                        >
                          Spa & Dental package
                        </option>
                        <option
                          value="nail-trim"
                          className="bg-[#d0999a] text-white"
                        >
                          Just a nail trim / paw care
                        </option>
                      </select>
                    </div>
                    {user && pets.length > 0 && (
                      <div>
                        <label htmlFor="booking-pet" className="sr-only">
                          Select your pet
                        </label>
                        <select
                          id="booking-pet"
                          ref={petRef}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white outline-none focus:border-white/60"
                        >
                          <option value="" className="bg-[#d0999a] text-white">
                            Select your pet
                          </option>
                          {pets.map((pet: { id: number; name: string; species: string; breed: string | null }) => (
                            <option key={pet.id} value={pet.id} className="bg-[#d0999a] text-white">
                              {pet.name} ({pet.species}{pet.breed ? ` - ${pet.breed}` : ""})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label htmlFor="booking-date" className="sr-only">
                        Preferred date
                      </label>
                      <input
                        id="booking-date"
                        ref={dateRef}
                        type="text"
                        placeholder="Preferred date (e.g., Monday 10am)"
                        maxLength={50}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-notes" className="sr-only">
                        Notes about your pet
                      </label>
                      <textarea
                        id="booking-notes"
                        ref={notesRef}
                        rows={2}
                        placeholder="Tell us about your pet (breed, special notes...)"
                        maxLength={500}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 resize-none"
                      />
                    </div>
                    <div className="bg-white/15 rounded-xl p-3 space-y-2">
                      <p className="text-white font-semibold text-sm">
                        💳 {booking.advancePaymentTitle}
                      </p>
                      <p className="text-white/60 text-xs">
                        {booking.advancePaymentDetail}
                      </p>
                      <div>
                        <label htmlFor="booking-transaction" className="sr-only">
                          UPI Reference Number
                        </label>
                        <input
                          id="booking-transaction"
                          ref={transactionIdRef}
                          type="text"
                          placeholder={booking.upiPlaceholder}
                          required
                          maxLength={50}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                        />
                      </div>
                      <p className="text-white/50 text-[10px] leading-tight">
                        💡 {booking.upiTooltip}
                      </p>
                    </div>
                    {submitStatus === "error" && (
                      <p
                        role="alert"
                        className="text-red-200 text-sm text-center bg-red-500/20 rounded-lg p-2"
                      >
                        {errorMessage}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={submitStatus === "loading"}
                      className="w-full py-3 rounded-full bg-white font-semibold text-lg transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ color: BRAND_PINK }}
                    >
                      {submitStatus === "loading" ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>{booking.submittingLabel}</span>
                        </>
                      ) : (
                        <>✉️ {booking.submitLabel}</>
                      )}
                    </button>
                  </form>
                  <p className="text-white/60 text-xs text-center mt-3">
                    We'll contact you to confirm your slot!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BookingModal;
