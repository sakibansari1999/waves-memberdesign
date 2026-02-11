import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");

  // Timer effect for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validate email
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    // Simulate sending OTP
    setShowOTP(true);
    setResendTimer(30); // 30 seconds cooldown
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Simulate OTP verification
    if (otpValue.length === 6) {
      // Create user object and login
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        loginMethod: "otp" as const,
      };
      login(newUser);
      // Navigate to home
      navigate("/");
    } else {
      setError("Please enter the complete OTP");
    }
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validate fields
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    // Simulate password verification
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      loginMethod: "password" as const,
    };
    login(newUser);
    // Navigate to home
    navigate("/");
  };

  const handleResend = () => {
    // Simulate resending OTP
    console.log("Resending OTP...");
    setResendTimer(30); // Reset timer
  };

  const handleBackToLogin = () => {
    setShowOTP(false);
    setOtpValue("");
    setEmail("");
    setError("");
  };

  if (showOTP && loginMethod === "otp") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-[540px] bg-white rounded-lg shadow-lg p-8">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBackToLogin}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-gray-900 text-3xl font-bold mb-2">
              Verify OTP
            </h1>
            <p className="text-gray-500 text-base">
              Enter the 6-digit code sent to<br />
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={otpValue.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Continue
            </Button>

            {/* Resend & Change Email */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                  </button>
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4 text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Change Email Address
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[540px] bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-900 text-3xl font-bold mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-base">
            Sign in with OTP or email & password to continue
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <Tabs
          value={loginMethod}
          onValueChange={(value) => {
            setLoginMethod(value as "otp" | "password");
            // Reset form when switching tabs
            setEmail("");
            setPassword("");
            setOtpValue("");
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="otp"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <Mail className="w-4 h-4" />
              OTP Login
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <Lock className="w-4 h-4" />
              Email & Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="otp">
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-otp" className="text-gray-900 text-sm">
                  Email Address
                </Label>
                <Input
                  id="email-otp"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="bg-white border-gray-300"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold"
              >
                Send OTP
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="password">
            <form onSubmit={handlePasswordLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-password" className="text-gray-900 text-sm">
                  Email Address
                </Label>
                <Input
                  id="email-password"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="bg-white border-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-900 text-sm">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      // Handle forgot password
                      console.log("Navigate to forgot password");
                    }}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-white border-gray-300 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold"
              >
                Sign In
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
