import { Link, useNavigate } from "react-router-dom";
import { User, UserCircle, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  // Get user initials from email
  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  // Get display name from email
  const getDisplayName = (email: string) => {
    return email.split("@")[0].replace(/\./g, " ");
  };

  return (
    <header className="w-full h-[78px] bg-white border-b border-gray-500/25 flex items-center justify-between px-4 md:px-6 lg:px-10">
      <Link to={isAuthenticated ? "/" : "/welcome"} className="flex-shrink-0">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/9b9b095f93ea45803cfc60cf88ccfe90fbf02d5f?width=270"
          alt="WAV List"
          className="h-12 w-auto"
        />
      </Link>

      {isAuthenticated && (
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link
            to="/search"
            className="text-gray-900 font-medium text-base hover:text-blue-primary transition-colors"
          >
            Search
          </Link>
          <Link to="/" className="text-blue-primary font-bold text-base">
            Browse Boats
          </Link>
          <Link
            to="/bookings"
            className="text-gray-900 font-medium text-base hover:text-blue-primary transition-colors"
          >
            My Bookings
          </Link>
          <Link
            to="/membership"
            className="text-gray-900 font-medium text-base hover:text-blue-primary transition-colors"
          >
            Membership
          </Link>
        </nav>
      )}

      <div className="flex items-center gap-4">
        {loading ? (
          // Loading state
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        ) : isAuthenticated && user ? (
          // Authenticated state - show user profile dropdown
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <div className="text-gray-900 font-semibold text-sm">
                    {getDisplayName(user.email)}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {user.loginMethod === "otp" ? "OTP Login" : "Email Login"}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {getInitials(user.email)}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-gray-900">
                  {getDisplayName(user.email)}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/logout"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Unauthenticated state - show Sign In button
          <Button
            onClick={() => navigate("/login")}
            className="bg-blue-primary hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2"
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
