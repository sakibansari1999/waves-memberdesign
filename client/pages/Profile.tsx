import { useState, useEffect } from "react";
import { User, Mail, Phone, UserPlus, AlertCircle, CheckCircle, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchProfile, saveProfile } from "@/utils/api";
import { isProfileComplete } from "@/utils/profileValidation";
import { MemberProfile, UpdateProfileRequest, SaveProfileResponse } from "@shared/types";

export default function Profile() {
  const { user, updateProfile, isNewLogin, clearNewLoginFlag } = useAuth();
  const [isLoading, setIsLoading] = useState(!user?.profile); // Only load if no profile in auth
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

  const [formData, setFormData] = useState<Partial<MemberProfile>>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip_code: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relation: "",
    notes: "",
    referral_source: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Use profile from auth context if available (from login response)
        let profileData = user?.profile;

        // If no profile in auth context, fetch from API
        if (!profileData) {
          const response = await fetchProfile<{ data: MemberProfile }>();
          profileData = response.data;
        }

        if (profileData) {
          setFormData(profileData);
          // Check if profile is incomplete (only on new login)
          if (isNewLogin) {
            setIsProfileIncomplete(!isProfileComplete(profileData));
          }
          // Show emergency contact section if data exists
          if (profileData.emergency_contact_name) {
            setShowEmergencyContact(true);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load profile data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.profile, isNewLogin]);

  // Clear the new login flag when leaving the profile page
  useEffect(() => {
    return () => {
      if (isNewLogin) {
        clearNewLoginFlag();
      }
    };
  }, [isNewLogin, clearNewLoginFlag]);

  const handleInputChange = (
    field: keyof MemberProfile,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      // Prepare update payload - only include editable fields with values
      const updateData: UpdateProfileRequest = {};

      // List of fields that users can edit
      const editableFields: (keyof UpdateProfileRequest)[] = [
        "first_name",
        "last_name",
        "phone",
        "date_of_birth",
        "gender",
        "address_line_1",
        "address_line_2",
        "city",
        "state",
        "zip_code",
        "emergency_contact_name",
        "emergency_contact_phone",
        "emergency_contact_relation",
        "notes",
        "referral_source",
      ];

      // Only include editable fields that have values
      editableFields.forEach((key) => {
        const value = formData[key];
        if (value !== null && value !== "" && value !== false) {
          updateData[key] = value as never;
        }
      });

      const response = await saveProfile<SaveProfileResponse>(updateData);
      
      // Update the profile in auth context
      if (response.data) {
        updateProfile(response.data);
      }

      setSuccessMessage(response.message || "Profile saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="mt-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-900 text-3xl font-bold mb-2">
            {isNewLogin && isProfileIncomplete
              ? "Complete Your Profile"
              : "Edit Your Profile"}
          </h1>
          <p className="text-gray-500 text-base">
            {isNewLogin && isProfileIncomplete
              ? "Please fill in your profile details to get started"
              : "Manage your account information and preferences"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-500" />
              <h2 className="text-gray-900 text-lg font-semibold">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-gray-900 text-sm">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name || ""}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  placeholder="John"
                  className="bg-gray-50 border-gray-300"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-gray-900 text-sm">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name || ""}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  placeholder="Doe"
                  className="bg-gray-50 border-gray-300"
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-gray-900 text-sm"
              >
                <Mail className="w-4 h-4" />
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                placeholder="john@example.com"
                className="bg-gray-50 border-gray-300"
                disabled
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-gray-900 text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    handleInputChange("phone", e.target.value)
                  }
                  placeholder="+1 (555) 000-0000"
                  className="bg-gray-50 border-gray-300"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-900 text-sm">
                  Gender
                </Label>
                <select
                  id="gender"
                  value={formData.gender || ""}
                  onChange={(e) =>
                    handleInputChange("gender", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="date_of_birth" className="text-gray-900 text-sm">
                Date of Birth
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ""}
                onChange={(e) =>
                  handleInputChange("date_of_birth", e.target.value)
                }
                className="bg-gray-50 border-gray-300"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Address Information Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-gray-900 text-lg font-semibold mb-4">
              Address Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="address_line_1"
                  className="text-gray-900 text-sm"
                >
                  Address Line 1
                </Label>
                <Input
                  id="address_line_1"
                  type="text"
                  value={formData.address_line_1 || ""}
                  onChange={(e) =>
                    handleInputChange("address_line_1", e.target.value)
                  }
                  placeholder="123 Main Street"
                  className="bg-gray-50 border-gray-300"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="address_line_2"
                  className="text-gray-900 text-sm"
                >
                  Address Line 2
                </Label>
                <Input
                  id="address_line_2"
                  type="text"
                  value={formData.address_line_2 || ""}
                  onChange={(e) =>
                    handleInputChange("address_line_2", e.target.value)
                  }
                  placeholder="Apartment, suite, etc."
                  className="bg-gray-50 border-gray-300"
                  disabled={isSaving}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-900 text-sm">
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) =>
                      handleInputChange("city", e.target.value)
                    }
                    placeholder="New York"
                    className="bg-gray-50 border-gray-300"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-900 text-sm">
                    State
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    value={formData.state || ""}
                    onChange={(e) =>
                      handleInputChange("state", e.target.value)
                    }
                    placeholder="NY"
                    className="bg-gray-50 border-gray-300"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip_code" className="text-gray-900 text-sm">
                    Zip Code
                  </Label>
                  <Input
                    id="zip_code"
                    type="text"
                    value={formData.zip_code || ""}
                    onChange={(e) =>
                      handleInputChange("zip_code", e.target.value)
                    }
                    placeholder="10001"
                    className="bg-gray-50 border-gray-300"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="border-t border-gray-200 pt-8">
            <button
              type="button"
              onClick={() => setShowEmergencyContact(!showEmergencyContact)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 font-medium text-sm rounded-md hover:bg-gray-200 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              {showEmergencyContact ? "Hide" : "Add"} Emergency Contact
            </button>

            {showEmergencyContact && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                <h3 className="text-gray-900 font-medium text-sm">
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-900 text-sm">
                      Contact Name
                    </Label>
                    <Input
                      type="text"
                      value={formData.emergency_contact_name || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "emergency_contact_name",
                          e.target.value
                        )
                      }
                      placeholder="Jane Doe"
                      className="bg-white border-gray-300"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-900 text-sm">
                      Relationship
                    </Label>
                    <Input
                      type="text"
                      value={formData.emergency_contact_relation || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "emergency_contact_relation",
                          e.target.value
                        )
                      }
                      placeholder="Spouse"
                      className="bg-white border-gray-300"
                      disabled={isSaving}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 text-sm">
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    value={formData.emergency_contact_phone || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "emergency_contact_phone",
                        e.target.value
                      )
                    }
                    placeholder="+1 (555) 000-0001"
                    className="bg-white border-gray-300"
                    disabled={isSaving}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Information Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-gray-900 text-lg font-semibold mb-4">
              Additional Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-900 text-sm">
                  Notes
                </Label>
                <textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) =>
                    handleInputChange("notes", e.target.value)
                  }
                  placeholder="Any additional notes or preferences..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="referral_source"
                  className="text-gray-900 text-sm"
                >
                  How did you hear about us?
                </Label>
                <Input
                  id="referral_source"
                  type="text"
                  value={formData.referral_source || ""}
                  onChange={(e) =>
                    handleInputChange("referral_source", e.target.value)
                  }
                  placeholder="Friend, Google, Social Media, etc."
                  className="bg-gray-50 border-gray-300"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {/* Membership & Payment Information (Read-only) */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-gray-500" />
              <h2 className="text-gray-900 text-lg font-semibold">
                Membership & Payment Information
              </h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              These settings are managed by our support team. Contact us to make changes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-900 text-sm font-medium">
                    Membership Type
                  </Label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900 text-sm capitalize">
                    {formData.membership_type || "—"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900 text-sm font-medium">
                    Membership Start Date
                  </Label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900 text-sm">
                    {formData.membership_start_date
                      ? new Date(formData.membership_start_date).toLocaleDateString()
                      : "—"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900 text-sm font-medium">
                    Billing Cycle
                  </Label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900 text-sm capitalize">
                    {formData.billing_cycle || "—"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900 text-sm font-medium">
                    Preferred Location
                  </Label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900 text-sm capitalize">
                    {formData.preferred_location?.replace("-", " ") || "—"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-900 text-sm font-medium">
                    Auto-Renewal
                  </Label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900 text-sm">
                    {formData.auto_renewal ? "Enabled" : "Disabled"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900 text-sm font-medium">
                    Payment Method
                  </Label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900 text-sm capitalize">
                    {formData.payment_method?.replace("-", " ") || "—"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900 text-sm font-medium">
                    Card Last Four Digits
                  </Label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900 text-sm">
                    {formData.card_last_four ? `•••• ${formData.card_last_four}` : "—"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900 text-sm font-medium">
                    Card Expiry
                  </Label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-900 text-sm">
                    {formData.card_expiry || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
