import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, PawPrint } from "lucide-react";
import { nhost } from "@/lib/nhost";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/ui/AuthModal";
import { designTokens } from "@/config/site-content";

const BRAND_PINK = designTokens.brandPink;

export function UserMenu() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await nhost.auth.signOut({});
    setMenuOpen(false);
    navigate("/");
  };

  if (!user) {
    return (
      <>
        <button
          onClick={() => setAuthOpen(true)}
          className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-all"
        >
          Sign In
        </button>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-all"
      >
        <User size={16} />
        <span className="max-w-[100px] truncate">
          {user.displayName ?? user.email}
        </span>
      </button>
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/20 backdrop-blur-xl z-50 overflow-hidden"
            style={{ backgroundColor: `${BRAND_PINK}E6` }}
          >
            <button
              onClick={() => { navigate("/profile"); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-white text-sm hover:bg-white/10 transition-colors text-left"
            >
              <PawPrint size={16} />
              My Profile
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-white text-sm hover:bg-white/10 transition-colors text-left border-t border-white/10"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserMenu;
