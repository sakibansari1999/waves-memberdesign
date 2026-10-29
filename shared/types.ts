/**
 * Member Profile Data Types
 * Based on Laravel Member model
 */

export interface MemberProfile {
  id: number;

  /* Personal Information */
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  gender: string | null;

  /* Address Information */
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;

  /* Emergency Contact */
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relation: string | null;

  /* Membership Details */
  membership_type: string | null;
  membership_start_date: string | null;
  billing_cycle: string | null;
  preferred_location: string | null;
  auto_renewal: boolean;

  /* Payment Information */
  payment_method: string | null;
  card_last_four: string | null;
  card_expiry: string | null;

  /* Additional Info */
  notes: string | null;
  referral_source: string | null;

  /* Profile */
  profile_photo: string | null;

  /* Status */
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Profile update request - only user-editable fields
 * Payment, membership, and system fields are handled by Laravel backend
 */
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  notes?: string;
  referral_source?: string;
}

export interface ProfileApiResponse {
  data: MemberProfile;
  message?: string;
}

export interface SaveProfileResponse {
  data: MemberProfile;
  message: string;
}
