/**
 * This file is no longer used.
 * The frontend calls Laravel API directly via VITE_API_BASE_URL.
 * No need for Express to proxy these requests.
 * 
 * API endpoints are called directly from:
 * - client/utils/api.ts (apiCall, fetchProfile, saveProfile)
 * - client/pages/Login.tsx (publicApiCall for auth)
 * - client/pages/Profile.tsx (uses apiCall utilities)
 */
