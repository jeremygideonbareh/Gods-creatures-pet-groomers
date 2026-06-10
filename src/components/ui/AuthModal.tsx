import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { nhost } from "@/lib/nhost";
import { designTokens } from "@/config/site-content";
import { useAuth } from "@/context/AuthContext";

const CREATE_PET = gql`
  mutation CreatePetFromSignup(
    $name: String!
    $species: String!
    $breed: String!
    $age_years: Int
    $weight_kg: numeric
    $coat_condition: String
    $medical_history: String
    $behavioral_notes: String
    $vet_contact: String
  ) {
    insert_pets_one(object: {
      name: $name
      species: $species
      breed: $breed
      age_years: $age_years
      weight_kg: $weight_kg
      coat_condition: $coat_condition
      medical_history: $medical_history
      behavioral_notes: $behavioral_notes
      vet_contact: $vet_contact
    }) { id }
  }
`;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

const BRAND_PINK = designTokens.brandPink;

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [coatCondition, setCoatCondition] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [behavioralNotes, setBehavioralNotes] = useState("");
  const [vetContact, setVetContact] = useState("");

  const apolloClient = useApolloClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "reset") {
        await nhost.auth.sendPasswordResetEmail({ email });
        setSuccess("If this email is registered, a password reset link has been sent.");
        setLoading(false);
        return;
      }
      if (user) {
        onAuthSuccess?.();
        setLoading(false);
        return;
      }
      if (mode === "signin") {
        const res = await nhost.auth.signInEmailPassword({ email, password });
        if (!res.body.session) {
          setError("Check your email for the verification link before signing in.");
          setLoading(false);
          return;
        }
        onAuthSuccess?.();
      } else {
        const res = await nhost.auth.signUpEmailPassword({ email, password });
        if (!res.body.session) {
          setSuccess("Account created! Check your email for the verification link, then sign in.");
          setMode("signin");
          setLoading(false);
          return;
        }
        if (petName) {
          try {
            await apolloClient.mutate({
              mutation: CREATE_PET,
              variables: {
                name: petName,
                species: species || "Dog",
                breed,
                age_years: age ? parseInt(age, 10) : null,
                weight_kg: weight ? parseFloat(weight) : null,
                coat_condition: coatCondition || null,
                medical_history: medicalHistory || null,
                behavioral_notes: behavioralNotes || null,
                vet_contact: vetContact || null,
              },
            });
          } catch (petErr) {
            console.error("Failed to create pet:", petErr);
          }
        }
        onAuthSuccess?.();
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errorBody = err && typeof err === "object" && "body" in err
        ? (err as { body: { message?: string; error?: string } }).body
        : null;
      const errorCode = errorBody?.error;
      const errorMessage = errorBody?.message || (err instanceof Error ? err.message : "");
      if (errorCode === "unverified-user") {
        setError("Email not verified yet. Check your inbox (and spam folder) for the verification link.");
      } else if (errorCode === "invalid-email-password") {
        setError("Invalid email or password.");
      } else if (errorCode === "signup-disabled") {
        setError("New account registration is currently disabled.");
      } else if (errorCode === "user-already-exists") {
        setError("An account with this email already exists.");
      } else {
        setError(errorMessage || "An unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setPetName("");
      setSpecies("");
      setBreed("");
      setAge("");
      setWeight("");
      setCoatCondition("");
      setMedicalHistory("");
      setBehavioralNotes("");
      setVetContact("");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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
            transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
            className="relative w-full max-w-md rounded-3xl p-8 border border-white/20 overflow-y-auto max-h-[90vh]"
            style={{ backgroundColor: BRAND_PINK }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {mode === "signin" ? "🐾 Welcome Back" : mode === "signup" ? "🐾 Join Us" : "🐾 Reset Password"}
            </h2>
            <p className="text-white/80 text-center mb-6">
              {mode === "signin"
                ? "Sign in to manage your pets and bookings."
                : mode === "signup"
                  ? "Create an account and tell us about your pet!"
                  : "Enter your email and we'll send a reset link."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="auth-email" className="sr-only">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                />
              </div>
              {mode !== "reset" && (
                <div className="relative">
                  <label htmlFor="auth-password" className="sr-only">Password</label>
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}
              {mode === "signin" && (
                <div className="text-right -mt-2">
                  <button
                    type="button"
                    onClick={() => { setMode("reset"); setError(""); setSuccess(""); }}
                    className="text-white/60 text-xs hover:text-white underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {mode === "signup" && (
                <>
                  <div className="border-t border-white/20 pt-3 mt-2">
                    <p className="text-white/80 text-xs font-semibold mb-3 uppercase tracking-wider">
                      🐾 Tell us about your pet
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="auth-pet-name" className="sr-only">Pet name</label>
                        <input
                          id="auth-pet-name"
                          type="text"
                          placeholder="Pet name *"
                          required
                          maxLength={100}
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label htmlFor="auth-species" className="sr-only">Species</label>
                          <select
                            id="auth-species"
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white outline-none focus:border-white/60"
                          >
                            <option value="" className="bg-[#d0999a] text-white">Species *</option>
                            <option value="Dog" className="bg-[#d0999a] text-white">Dog</option>
                            <option value="Cat" className="bg-[#d0999a] text-white">Cat</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label htmlFor="auth-breed" className="sr-only">Breed</label>
                          <input
                            id="auth-breed"
                            type="text"
                            placeholder="Breed"
                            maxLength={100}
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label htmlFor="auth-age" className="sr-only">Age (years)</label>
                          <input
                            id="auth-age"
                            type="number"
                            placeholder="Age (years)"
                            min={0}
                            max={50}
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor="auth-weight" className="sr-only">Weight (kg)</label>
                          <input
                            id="auth-weight"
                            type="number"
                            placeholder="Weight (kg)"
                            min={0}
                            max={200}
                            step={0.1}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="auth-coat" className="sr-only">Coat condition</label>
                        <input
                          id="auth-coat"
                          type="text"
                          placeholder="Coat condition (e.g., dry, shedding, healthy)"
                          maxLength={200}
                          value={coatCondition}
                          onChange={(e) => setCoatCondition(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                        />
                      </div>
                      <div>
                        <label htmlFor="auth-medical" className="sr-only">Medical history</label>
                        <textarea
                          id="auth-medical"
                          placeholder="Medical history (allergies, medications, conditions...)"
                          rows={2}
                          maxLength={500}
                          value={medicalHistory}
                          onChange={(e) => setMedicalHistory(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 resize-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="auth-behavior" className="sr-only">Behavioral notes</label>
                        <textarea
                          id="auth-behavior"
                          placeholder="Behavioral notes (anxious, energetic, shy...)"
                          rows={2}
                          maxLength={500}
                          value={behavioralNotes}
                          onChange={(e) => setBehavioralNotes(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 resize-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="auth-vet" className="sr-only">Vet contact</label>
                        <input
                          id="auth-vet"
                          type="text"
                          placeholder="Vet contact (name/clinic + phone)"
                          maxLength={200}
                          value={vetContact}
                          onChange={(e) => setVetContact(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <p role="alert" className="text-red-200 text-sm text-center bg-red-500/20 rounded-lg p-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-200 text-sm text-center bg-green-500/20 rounded-lg p-2">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-white font-semibold text-lg transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ color: BRAND_PINK }}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{mode === "signin" ? "Signing in..." : mode === "signup" ? "Creating account..." : "Sending..."}</span>
                  </>
                ) : (
                  <>{mode === "signin" ? "📥 Sign In" : mode === "signup" ? "✨ Sign Up" : "✉️ Send Reset Link"}</>
                )}
              </button>
            </form>

            <p className="text-white/60 text-xs text-center mt-4">
              {mode === "reset" ? (
                <button
                  onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                  className="text-white underline hover:no-underline"
                >
                  Back to sign in
                </button>
              ) : mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
                    className="text-white underline hover:no-underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                    className="text-white underline hover:no-underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
