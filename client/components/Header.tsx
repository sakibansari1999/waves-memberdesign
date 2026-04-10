import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Reserve a Boat", href: "/browse" },
  { label: "My Reservations", href: "/my-reservations" },
  { label: "Billing", href: "/billing" },
];

function WavesLogo() {
  return (
    <Link to="/" className="flex items-center gap-3 flex-shrink-0">
      
      {/* ✅ FIXED LOGO (no blue box, proper size) */}
      <img 
        src="/logo-dark.png" 
        alt="Logo" 
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
}

function PlatinumBadge() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-400 bg-gradient-to-r from-slate-200 to-slate-300">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M6.74436 1.90514C6.79564 1.81201 6.89354 1.75415 6.99986 1.75415C7.10618 1.75415 7.20408 1.81201 7.25536 1.90514L8.97736 5.17414C9.06051 5.32741 9.20786 5.43545 9.37904 5.46864C9.55023 5.50184 9.72728 5.45672 9.86169 5.34564L12.3566 3.20831C12.4549 3.12839 12.5935 3.12102 12.6997 3.19008C12.8058 3.25914 12.8553 3.38883 12.8221 3.51106L11.1689 9.48789C11.0996 9.73919 10.872 9.91398 10.6113 9.91606H3.38903C3.12813 9.91424 2.90017 9.7394 2.83078 9.48789L1.17819 3.51164C1.14498 3.38941 1.19446 3.25972 1.30064 3.19066C1.40682 3.1216 1.54543 3.12897 1.64369 3.20889L4.13803 5.34623C4.27244 5.4573 4.4495 5.50242 4.62068 5.46923C4.79186 5.43603 4.93921 5.32799 5.02236 5.17473L6.74436 1.90514Z" stroke="#1E293B" strokeWidth="1.2"/>
      </svg>
      <span className="text-xs font-semibold text-slate-800">Platinum</span>
    </div>
  );
}

function AvatarCircle({ initials }: { initials: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-[#3B63FF] flex items-center justify-center">
      <span className="text-white text-sm font-semibold">{initials}</span>
    </div>
  );
}

export default function Header() {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getInitials = (email: string) =>
    email.split("@")[0]
      .split(".")
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/" || location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="w-full h-[72px] bg-white border-b border-black/[0.08] flex items-center justify-between px-6 md:px-10 relative z-50">
      
      {/* Logo */}
      <WavesLogo />

      {/* Nav */}
      {isAuthenticated && !loading && (
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Right */}
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
        ) : isAuthenticated && user ? (
          <>
            <PlatinumBadge />
            <div className="w-px h-6 bg-black/[0.08]" />
            <div className="flex items-center gap-3">
              <AvatarCircle initials={getInitials(user.email)} />
              <button
                onClick={handleLogout}
                className="hidden md:block text-sm font-medium text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>

            <button
              className="md:hidden p-1 text-gray-700"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </>
        ) : (
        null
        )}
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && mobileOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-black/[0.08] shadow-lg md:hidden z-50">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-sm py-2.5",
                  isActive(link.href)
                    ? "text-gray-900 font-semibold"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="text-left text-sm py-2.5 text-red-600"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}