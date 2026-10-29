import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Perform logout
    logout();

    // Simulate logout process with delay
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, logout]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-blue-primary/10 flex items-center justify-center mx-auto mb-6">
          <LogOut className="w-10 h-10 text-blue-primary" />
        </div>
        <h1 className="text-gray-900 text-2xl font-bold mb-2">
          Logging you out...
        </h1>
        <p className="text-gray-500 text-base">
          Thank you for using WAVES. See you soon!
        </p>
      </div>
    </div>
  );
}
