import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { nhost } from "@/lib/nhost";
import { designTokens } from "@/config/site-content";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BRAND_PINK = designTokens.brandPink;

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "signin") {
        const res = await nhost.auth.signInEmailPassword({ email, password });
        if (!res.body.session) {
          setError("Check your email for the verification link before signing in.");
          setLoading(false);
          return;
        }
      } else {
        const res = await nhost.auth.signUpEmailPassword({ email, password });
        if (!res.body.session) {
          setSuccess("Account created! Check your email for the verification link, then sign in.");
          setMode("signin");
          setLoading(false);
          return;
        }
      }
      onClose();
    } catch (err) {
      console.error("Auth error:", err);
      const bodyMsg = err && typeof err === "object" && "body" in err
        ? (err as { body: { message?: string } }).body?.message
        : null;
      setError(bodyMsg || (err instanceof Error ? err.message : "An unexpected error occurred."));
      setLoading(false);
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
            transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
            className="relative w-full max-w-md rounded-3xl p-8 border border-white/20"
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
              {mode === "signin" ? "🐾 Welcome Back" : "🐾 Join Us"}
            </h2>
            <p className="text-white/80 text-center mb-6">
              {mode === "signin"
                ? "Sign in to manage your pets and bookings."
                : "Create an account to get started."}
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
                    <span>{mode === "signin" ? "Signing in..." : "Creating account..."}</span>
                  </>
                ) : (
                  <>{mode === "signin" ? "📥 Sign In" : "✨ Sign Up"}</>
                )}
              </button>
            </form>

            <p className="text-white/60 text-xs text-center mt-4">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(""); }}
                    className="text-white underline hover:no-underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setMode("signin"); setError(""); }}
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
