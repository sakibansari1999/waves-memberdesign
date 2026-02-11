import { useNavigate } from "react-router-dom";
import { Ship, MapPin, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4169E1] to-[#5B7FFF] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex flex-col items-center">
          {/* Wave SVG Logo */}
          {/* <svg
            width="120"
            height="40"
            viewBox="0 0 120 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-2"
          >
            <path
              d="M10 20C10 20 15 10 25 20C35 30 40 20 40 20C40 20 45 10 55 20C65 30 70 20 70 20C70 20 75 10 85 20C95 30 100 20 100 20"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M10 25C10 25 15 15 25 25C35 35 40 25 40 25C40 25 45 15 55 25C65 35 70 25 70 25C70 25 75 15 85 25C95 35 100 25 100 25"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <h1 className="text-white text-3xl md:text-4xl font-bold tracking-wider">
            WAVES
          </h1> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl w-full text-center">
        {/* Heading */}
        <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Welcome to WAVES
        </h2>

        {/* Subtitle */}
        <div className="mb-12">
          <p className="text-white text-base md:text-lg mb-2">
            Your gateway to unforgettable boating experiences.
          </p>
          <p className="text-white text-base md:text-lg">
            Book your perfect boat adventure in just a few taps.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-12 mb-12">
          {/* Premium Boats */}
          <div className="flex flex-col items-center text-white">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Ship className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm md:text-base font-medium">
              Premium Boats
            </span>
          </div>

          {/* Best Locations */}
          <div className="flex flex-col items-center text-white">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm md:text-base font-medium">
              Best Locations
            </span>
          </div>

          {/* Easy Bookings */}
          <div className="flex flex-col items-center text-white">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Anchor className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm md:text-base font-medium">
              Easy Bookings
            </span>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate("/profile")}
            className="w-full max-w-md bg-white text-blue-600 hover:bg-gray-100 font-semibold text-base py-6 rounded-lg shadow-lg"
          >
            Get Started
          </Button>
        </div>

        {/* Sign In Link */}
        <p className="text-white text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold underline hover:text-gray-200 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
