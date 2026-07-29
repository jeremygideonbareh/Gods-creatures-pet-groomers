import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, Menu, X, PawPrint } from "lucide-react";
import { nhost } from "@/lib/nhost";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, designTokens } from "@/config/site-content";
import UserMenu from "@/components/ui/UserMenu";

const BRAND_PINK = designTokens.brandPink;

interface NavbarProps {
  scrolled: boolean;
  activeSection: string;
  navItems: { id: string; label: string }[];
  onNavClick: (id: string) => void;
  onBookClick: () => void;
}

export function Navbar({ scrolled, activeSection, navItems, onNavClick, onBookClick }: NavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await nhost.auth.signOut({});
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-brand-pink/10"
          : "bg-gradient-to-b from-black/40 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavClick("hero")}
            className="flex items-center gap-2.5 group"
          >
            <div
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]"
              style={{ backgroundColor: BRAND_PINK }}
            >
              <PawPrint size={18} className="text-white" />
            </div>
            <span
              className={`font-heading text-base md:text-lg font-bold transition-colors duration-300 ${
                scrolled ? "text-brand-charcoal" : "text-white"
              }`}
            >
              Gods Creatures
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  activeSection === item.id
                    ? "text-brand-pink"
                    : scrolled
                    ? "text-brand-charcoal/70 hover:text-brand-charcoal hover:bg-black/5"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: BRAND_PINK }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* User menu (auth-aware) */}
            <div className={scrolled ? "" : "[&>button]:!text-white [&>button]:!border-white/30"}>
              <UserMenu />
            </div>

            {/* Book CTA (desktop) */}
            <button
              onClick={onBookClick}
              className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${
                scrolled
                  ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/25"
                  : "bg-white/15 text-white border border-white/30 hover:bg-white/25"
              }`}
            >
              <span>Book Now</span>
              <span>🐾</span>
            </button>

            {/* Admin button */}
            {isAdmin(user?.email) && (
              <button
                onClick={() => navigate("/admin")}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  scrolled
                    ? "bg-brand-pink/10 text-brand-charcoal hover:bg-brand-pink/20 border border-brand-pink/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
                }`}
              >
                <Shield size={14} />
                Admin
              </button>
            )}

            {/* Logout */}
            {user && (
              <button
                onClick={handleLogout}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  scrolled
                    ? "text-brand-charcoal/60 hover:text-red-500 hover:bg-red-50"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                aria-label="Sign Out"
              >
                <LogOut size={14} />
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${
                scrolled ? "text-brand-charcoal hover:bg-black/5" : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-brand-pink/10 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavClick(item.id); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-brand-pink/10 text-brand-pink"
                    : "text-brand-charcoal/70 hover:bg-black/5"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-brand-pink/10 pt-2 mt-2">
              <button
                onClick={() => { onBookClick(); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium bg-brand-pink text-white flex items-center gap-2"
              >
                <span>🐾</span> Book Appointment
              </button>
            </div>
            {isAdmin(user?.email) && (
              <button
                onClick={() => { navigate("/admin"); setMobileOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-brand-charcoal/70 hover:bg-black/5 flex items-center gap-2"
              >
                <Shield size={14} />
                Admin Panel
              </button>
            )}
            {user && (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500/70 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
