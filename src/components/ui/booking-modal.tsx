import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, Check } from "lucide-react";
import { designTokens, OPENING_HOURS, PRICING_MENU, RUPEESIGN } from "@/config/site-content";
import { useSiteContent } from "@/context/SiteContentContext";
import { useAuth } from "@/context/AuthContext";
import { GET_USER_PETS } from "@/lib/graphql";
import { nhost, NHOST_FUNCTIONS_URL } from "@/lib/nhost";
import type { PricingMenuContent } from "@/lib/content-service";
import { loadCashfreeScript, useCashfreeCheckout } from "@/components/payment/CheckoutGate";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PetSize = "cat" | "small" | "medium" | "large" | "xlarge";

const BRAND_PINK = designTokens.brandPink;

const SIZE_LABELS: Record<PetSize, string> = {
  cat: "Cat",
  small: "Small (Up to 10kg)",
  medium: "Medium (10-20kg)",
  large: "Large (20-35kg)",
  xlarge: "Extra Large (Above 35kg)",
};

function getPetSize(weightKg: number | null): PetSize {
  if (!weightKg || weightKg <= 10) return "small";
  if (weightKg <= 20) return "medium";
  if (weightKg <= 35) return "large";
  return "xlarge";
}

function getPrice(
  item: { prices?: { cat?: number; small?: number; medium?: number; large?: number; xlarge?: number }; flat?: number },
  size: PetSize,
): number {
  if (item.flat !== undefined) return item.flat;
  const p = item.prices;
  if (!p) return 0;
  if (size === "medium" && !p.medium) return p.small ?? 0;
  return (p[size] || p.small) ?? 0;
}

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
  const [manualPayment, setManualPayment] = useState(false);

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [manualSize, setManualSize] = useState<PetSize | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotLoading, setSlotLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { content } = useSiteContent();
  const booking = content.booking;
  const pricing = (content.pricingMenu || PRICING_MENU) as PricingMenuContent;
  const { data: petData } = useQuery<{ pets: { id: string; name: string; species: string; breed: string | null; weight_kg: number | null }[] }>(GET_USER_PETS, { skip: !user });
  const pets = petData?.pets || [];

  const selectedPet = useMemo(() => {
    if (!selectedPetId) return null;
    return pets.find((p) => p.id.toString() === selectedPetId) || null;
  }, [selectedPetId, pets]);

  const petSize = useMemo(() => {
    if (!selectedPet) return null;
    return getPetSize(selectedPet.weight_kg ?? null);
  }, [selectedPet]);

  const effectiveSize = selectedPet?.species?.toLowerCase() === "cat" ? "cat" : (petSize || manualSize);

  const allServices = useMemo(() => {
    return [...pricing.basicServices, ...pricing.completePackages];
  }, [pricing]);

  const selectedPackage = useMemo(() => {
    if (!selectedPackageId) return null;
    return allServices.find((s) => s.id === selectedPackageId) || null;
  }, [selectedPackageId, allServices]);

  const addonTotal = useMemo(() => {
    if (!effectiveSize) return 0;
    return selectedAddOns.reduce((sum, addonId) => {
      const addon = pricing.addOnServices.find((a) => a.id === addonId);
      if (!addon) return sum;
      return sum + getPrice(addon, effectiveSize);
    }, 0);
  }, [selectedAddOns, effectiveSize, pricing]);

  const packageTotal = useMemo(() => {
    if (!effectiveSize || !selectedPackage) return 0;
    return getPrice(selectedPackage, effectiveSize);
  }, [selectedPackage, effectiveSize]);

  const totalPrice = packageTotal + addonTotal;

  useEffect(() => {
    if (!isOpen) {
      setStep("info");
      setSubmitStatus("idle");
      setErrorMessage("");
      setManualPayment(false);
      setSelectedPackageId(null);
      setSelectedAddOns([]);
      setSelectedPetId("");
      setManualSize(null);
      setSelectedDate("");
      setSelectedSlot(null);
      setBookedSlots([]);
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
    if (!selectedDate) {
      setBookedSlots([]);
      return;
    }
    const day = new Date(selectedDate + "T00:00:00").getDay();
    const info = OPENING_HOURS[day];
    if (!info || info.slots.length === 0) {
      setBookedSlots([]);
      return;
    }
    let cancelled = false;
    setSlotLoading(true);
    fetch(`${NHOST_FUNCTIONS_URL}/get-booked-slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferred_date: selectedDate }),
    })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setBookedSlots(d?.booked ?? []); })
      .catch(() => { if (!cancelled) setBookedSlots([]); })
      .finally(() => { if (!cancelled) setSlotLoading(false); });
    return () => { cancelled = true; };
  }, [selectedDate]);

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

  const toggleAddon = (addonId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const [paymentLoading, setPaymentLoading] = useState(false);
  const { startCheckout } = useCashfreeCheckout();

  useEffect(() => {
    if (isOpen && !document.getElementById("cashfree-sdk")) {
      loadCashfreeScript().catch(console.warn);
    }
  }, [isOpen, loadCashfreeScript]);

  const handleCashfreePayment = async () => {
    setErrorMessage("");
    setSubmitStatus("idle");

    const email = emailRef.current?.value.trim() || "";
    const phone = phoneRef.current?.value.trim() || "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setSubmitStatus("error");
      return;
    }

if (!phone || !/^\+?\d{7,15}$/.test(phone.replace(/[\s-]/g, ""))) {
          setErrorMessage("Please enter your phone number (7-15 digits).");
      setSubmitStatus("error");
      return;
    }

    if (!selectedPackage) {
      setErrorMessage("Please select a grooming package.");
      setSubmitStatus("error");
      return;
    }

    if (!effectiveSize) {
      setErrorMessage("Please select your pet's size.");
      setSubmitStatus("error");
      return;
    }

    if (!selectedSlot) {
      setErrorMessage("Please select a time slot.");
      setSubmitStatus("error");
      return;
    }

    setPaymentLoading(true);

    try {
      const token = nhost.getUserSession()?.accessToken;
      if (!token) {
        setErrorMessage("Please sign in to book an appointment.");
        setPaymentLoading(false);
        return;
      }

      const addonLabels = selectedAddOns
        .map((id) => {
          const addon = pricing.addOnServices.find((a) => a.id === id);
          return addon?.label || id;
        });

      const serviceLabel = selectedPackage?.label || "";
      const preferredDate = selectedDate;
      const selectedPetUuid = selectedPetId || null;

      // Step A: Create booking + Cashfree order server-side
      const orderRes = await fetch(`${NHOST_FUNCTIONS_URL}/create-booking-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          customer_name: nameRef.current?.value || "",
          customer_email: email,
          customer_phone: phone,
          service: serviceLabel + (effectiveSize ? ` - ${SIZE_LABELS[effectiveSize]}` : ""),
          preferred_date: preferredDate,
          preferred_time: selectedSlot,
          notes: notesRef.current?.value || "",
          pet_id: selectedPetUuid,
          addons: addonLabels,
          total_price: totalPrice,
        }),
      });

      if (!orderRes.ok) {
        const errBody = await orderRes.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to create booking");
      }

      const { payment_session_id, booking_id, cashfree_order_id, payment_mode } = await orderRes.json();

      // Manual payment mode: skip the Cashfree checkout — the booking is already
      // created as pending_verification and the customer sends payment proof on
      // WhatsApp. Show the success panel with payment instructions instead.
      if (payment_mode === "manual") {
        setManualPayment(true);
        setPaymentLoading(false);
        setSubmitStatus("success");
        // Do NOT auto-close — the customer needs to read the payment instructions
        // and tap the WhatsApp button to send proof of payment.
        return;
      }

      // Step B+C: shared Cashfree checkout + confirm flow (CheckoutGate hook)
      const result = await startCheckout({
        paymentSessionId: payment_session_id,
        bookingId: booking_id,
        orderId: cashfree_order_id,
      });

      setPaymentLoading(false);

      if (result.status === "success") {
        // Receipt email is now sent server-side by confirm-booking — nothing to do here.
        setSubmitStatus("success");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (result.status === "cancelled") {
        // Payment cancelled or failed — booking stays as "pending_payment"
        setErrorMessage("Payment was cancelled or failed. Your booking draft has been saved. Please try again.");
      } else if (result.status === "pending") {
        setErrorMessage(
          "Payment was received but booking confirmation is pending. " +
          "Your booking will be confirmed shortly. Please contact us if this persists."
        );
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setPaymentLoading(false);
      console.error("Booking error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to process booking");
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
              className="relative w-full max-w-lg rounded-3xl p-4 sm:p-6 border border-white/20 max-h-[90vh] overflow-y-auto"
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
                  {manualPayment && (
                    <>
                      <div className="bg-white/20 rounded-xl p-4 mt-4 text-left">
                        <p className="text-white font-semibold text-sm">{booking.advancePaymentTitle}</p>
                        <p className="text-white/80 text-sm mt-1">{booking.advancePaymentDetail}</p>
                      </div>
                      <p className="text-white/80 text-sm mt-3">{booking.whatsappConfirmMessage}</p>
                      <a
                        href={`https://wa.me/${booking.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                      >
                        Send Proof on WhatsApp
                      </a>
                    </>
                  )}
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

                  <form id="booking-form" onSubmit={(e) => e.preventDefault()} className="space-y-3">
                    <div>
                      <label htmlFor="booking-name" className="sr-only">
                        Your name
                      </label>
                      <input
                        id="booking-name"
                        ref={nameRef}
                        type="text"
                        placeholder="Your name *"
                        required={!user}
                        maxLength={100}
                        defaultValue={user?.displayName ?? ""}
                        readOnly={!!user}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 read-only:opacity-60 read-only:cursor-not-allowed"
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
                        required={!user}
                        maxLength={255}
                        defaultValue={user?.email ?? ""}
                        readOnly={!!user}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 read-only:opacity-60 read-only:cursor-not-allowed"
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

                    {user && pets.length > 0 && (
                      <div>
                        <label htmlFor="booking-pet" className="sr-only">
                          Select your pet
                        </label>
                        <select
                          id="booking-pet"
                          value={selectedPetId}
                          onChange={(e) => {
                            setSelectedPetId(e.target.value);
                            setSelectedPackageId(null);
                            setSelectedAddOns([]);
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white outline-none focus:border-white/60"
                        >
                          <option value="" className="bg-[#d0999a] text-white">
                            Select your pet
                          </option>
                          {pets.map((pet) => (
                            <option key={pet.id} value={pet.id} className="bg-[#d0999a] text-white">
                              {pet.name} ({pet.species}{pet.breed ? ` - ${pet.breed}` : ""})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {selectedPet && petSize ? (
                      <div className="bg-white/20 rounded-xl px-3 py-2 text-center">
                        <p className="text-white text-sm font-medium">
                          🐾 {selectedPet.name} &mdash; {selectedPet.species} &middot; {SIZE_LABELS[petSize]}
                          {selectedPet.weight_kg ? ` (${selectedPet.weight_kg} kg)` : ""}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">
                          🐕 Pet Size
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(Object.entries(SIZE_LABELS) as [PetSize, string][]).map(([sizeKey, label]) => (
                            <button
                              key={sizeKey}
                              type="button"
                              onClick={() => { setManualSize(sizeKey); setSelectedPackageId(null); setSelectedAddOns([]); }}
                              className={`px-3 py-2 rounded-xl text-sm text-left transition-all ${
                                manualSize === sizeKey
                                  ? "bg-white text-pink-700 font-semibold"
                                  : "bg-white/15 text-white hover:bg-white/25"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {effectiveSize && (
                      <>
                        <div>
                          <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">
                            📋 Basic Services
                          </p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {(pricing.basicServices || []).map((svc) => {
                              const price = getPrice(svc, effectiveSize);
                              const isSelected = selectedPackageId === svc.id;
                              return (
                                <button
                                  key={svc.id}
                                  type="button"
                                  onClick={() => setSelectedPackageId(svc.id)}
                                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-all ${
                                    isSelected
                                      ? "bg-white text-pink-700 font-semibold"
                                      : "bg-white/15 text-white hover:bg-white/25"
                                  }`}
                                >
                                  <span>{svc.label}</span>
                                  <span className="tabular-nums">{RUPEESIGN}{price.toLocaleString("en-IN")}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">
                            🎁 Complete Packages
                          </p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {(pricing.completePackages || []).map((pkg) => {
                              const price = getPrice(pkg, effectiveSize);
                              const isSelected = selectedPackageId === pkg.id;
                              return (
                                <button
                                  key={pkg.id}
                                  type="button"
                                  onClick={() => setSelectedPackageId(pkg.id)}
                                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-all ${
                                    isSelected
                                      ? "bg-white text-pink-700 font-semibold"
                                      : "bg-white/15 text-white hover:bg-white/25"
                                  }`}
                                >
                                  <span>{pkg.label}</span>
                                  <span className="tabular-nums">{RUPEESIGN}{price.toLocaleString("en-IN")}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">
                            ✨ Add-On Services
                          </p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {(pricing.addOnServices || []).map((addon) => {
                              const price = getPrice(addon, effectiveSize);
                              const isChecked = selectedAddOns.includes(addon.id);
                              return (
                                <button
                                  key={addon.id}
                                  type="button"
                                  onClick={() => toggleAddon(addon.id)}
                                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-all ${
                                    isChecked
                                      ? "bg-white/30 text-white font-semibold"
                                      : "bg-white/15 text-white/80 hover:bg-white/25"
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                      isChecked
                                        ? "bg-white border-white"
                                        : "border-white/40"
                                    }`}>
                                      {isChecked && <Check size={12} className="text-pink-700" />}
                                    </span>
                                    {addon.label}
                                  </span>
                                  <span className="tabular-nums">+{RUPEESIGN}{price.toLocaleString("en-IN")}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="bg-white/10 rounded-xl p-3 border border-white/15">
                          <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">
                            🐾 {pricing.boardingRates?.label ?? "Boarding (per day)"}
                          </p>
                          <div className="space-y-1">
                            {(["small", "medium", "large", "xlarge"] as const).map((k) => (
                              <div key={k} className="flex justify-between text-white/80 text-sm">
                                <span className="capitalize">{k === "xlarge" ? "Extra Large" : k}</span>
                                <span className="tabular-nums">{RUPEESIGN}{(pricing.boardingRates?.rates?.[k] ?? 0).toLocaleString("en-IN")}/day</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-white/60 text-[11px] mt-2">{pricing.boardingRates?.note ?? "Discount on grooming prices given for boarding pets only."}</p>
                          <a
                            href={`tel:${pricing.boardingRates?.phone ?? "8798897732"}`}
                            className="inline-block mt-2 px-4 py-2 rounded-full bg-white text-pink-700 font-semibold text-sm"
                          >
                            📞 {pricing.boardingRates?.cta ?? "Call to book"}
                          </a>
                        </div>

                        {totalPrice > 0 && (
                          <div className="bg-white/20 rounded-xl p-3 space-y-1">
                            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                              💰 Price Breakdown
                            </p>
                            {selectedPackage && (
                              <div className="flex justify-between text-white text-sm">
                                <span>{selectedPackage.label}</span>
                                <span className="tabular-nums">{RUPEESIGN}{packageTotal.toLocaleString("en-IN")}</span>
                              </div>
                            )}
                            {selectedAddOns.map((addonId) => {
                              const addon = pricing.addOnServices.find((a) => a.id === addonId);
                              if (!addon) return null;
                              return (
                                <div key={addonId} className="flex justify-between text-white/80 text-xs pl-2">
                                  <span>{addon.label}</span>
                                  <span className="tabular-nums">+{RUPEESIGN}{getPrice(addon, effectiveSize).toLocaleString("en-IN")}</span>
                                </div>
                              );
                            })}
                            <div className="border-t border-white/30 pt-1 mt-1 flex justify-between text-white font-bold text-base">
                              <span>Total</span>
                              <span className="tabular-nums">{RUPEESIGN}{totalPrice.toLocaleString("en-IN")}</span>
                            </div>
                            <p className="text-white/50 text-[10px] pt-1">
                              * {RUPEESIGN}500 booking fee adjusted in final bill
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    <div>
                      <label htmlFor="booking-date" className="sr-only">
                        Preferred date
                      </label>
                      <input
                        id="booking-date"
                        ref={dateRef}
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedSlot(null);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white outline-none focus:border-white/60 [color-scheme:dark]"
                      />
                    </div>

                    {selectedDate && (() => {
                      const day = new Date(selectedDate + "T00:00:00").getDay();
                      const info = OPENING_HOURS[day];
                      if (!info) return null;
                      if (info.slots.length === 0) {
                        return (
                          <div className="bg-white/15 rounded-xl px-3 py-3 text-center">
                            <p className="text-white text-sm font-semibold">📞 {info.label} — {info.note}</p>
                            <a href="tel:8798897732" className="inline-block mt-1 text-white underline text-sm">Call us: 8798897732</a>
                          </div>
                        );
                      }
                      return (
                        <div>
                          <p className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">
                            🕐 {info.label} — Available Slots{slotLoading ? " (checking…)" : ""}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {info.slots.map((slot) => {
                              const isBooked = bookedSlots.includes(slot);
                              const isSelected = selectedSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={isBooked}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`px-3 py-2 rounded-xl text-sm transition-all ${
                                    isBooked
                                      ? "bg-white/10 text-white/40 line-through cursor-not-allowed"
                                      : isSelected
                                        ? "bg-white text-pink-700 font-semibold"
                                        : "bg-white/15 text-white hover:bg-white/25"
                                  }`}
                                >
                                  {slot}{isBooked ? " · Booked" : ""}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
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

                    <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-3 space-y-1">
                      <p className="text-amber-200 text-xs font-semibold flex items-center gap-1">
                        ⚠️ Please Note
                      </p>
                      <p className="text-amber-100/90 text-xs">
                        {`A ${RUPEESIGN}500 booking fee is required (adjusted in your final bill).`}
                      </p>
                    </div>

                    {submitStatus === "error" && (
                      <p
                        role="alert"
                        aria-describedby="booking-form"
                        className="text-red-200 text-sm text-center bg-red-500/20 rounded-lg p-2"
                      >
                        {errorMessage}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleCashfreePayment}
                      disabled={submitStatus === "loading" || paymentLoading}
                      className="w-full py-3 rounded-full bg-white font-semibold text-lg transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ color: BRAND_PINK }}
                    >
                      {submitStatus === "loading" || paymentLoading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>{paymentLoading ? "Opening Payment..." : booking.submittingLabel}</span>
                        </>
                      ) : (
                        <span>Book</span>
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
