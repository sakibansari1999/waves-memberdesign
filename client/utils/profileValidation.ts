import { MemberProfile } from "@shared/types";

/**
 * Necessary fields that must be completed for a valid profile
 * These are required on first login
 */
const REQUIRED_PROFILE_FIELDS: (keyof MemberProfile)[] = [
  "first_name",
  "last_name",
  "phone",
  "address_line_1",
  "city",
  "state",
  "zip_code",
];

/**
 * Check if a profile has all necessary/required fields completed
 * @param profile - User profile to validate
 * @returns true if all required fields are filled, false otherwise
 */
export function isProfileComplete(profile?: MemberProfile): boolean {
  if (!profile) return false;

  return REQUIRED_PROFILE_FIELDS.every((field) => {
    const value = profile[field];
    // Check if field exists and is not null/empty
    return value !== null && value !== undefined && value !== "";
  });
}

/**
 * Get list of missing required fields
 * @param profile - User profile to validate
 * @returns Array of field names that are missing/incomplete
 */
export function getMissingFields(profile?: MemberProfile): string[] {
  if (!profile) return REQUIRED_PROFILE_FIELDS.map(String);

  return REQUIRED_PROFILE_FIELDS.filter((field) => {
    const value = profile[field];
    return value === null || value === undefined || value === "";
  }).map(String);
}
