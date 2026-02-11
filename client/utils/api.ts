// Laravel API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface ApiOptions extends RequestInit {
  auth?: boolean; // Include auth token (default: true)
}

/**
 * Simple API call wrapper for Laravel backend
 * Automatically includes Bearer token if available
 */
export async function apiCall<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { auth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...fetchOptions.headers,
  };

  // Add Bearer token if needed
  if (auth) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Handle unauthorized
  if (response.status === 401) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    throw new Error("Unauthorized. Please login again.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error: ${response.status}`);
  }

  return data;
}

/**
 * Public API call (no auth token needed)
 */
export async function publicApiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  return apiCall<T>(endpoint, { ...options, auth: false });
}

/**
 * Fetch user profile
 */
export async function fetchProfile<T>(): Promise<T> {
  return apiCall<T>("/api/profile");
}

/**
 * Save/Update user profile
 */
export async function saveProfile<T>(
  data: Record<string, unknown>
): Promise<T> {
  return apiCall<T>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Fleet API Calls
 */

export interface BoatFilters {
  search?: string;
  date?: string;
  location?: string | string[];
  boat_type?: string | string[];
  length_min?: number;
  length_max?: number;
  features?: string | string[];
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface BoatListResponse {
  data: Boat[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface Boat {
  id: number;
  boat_name: string;
  type: string;
  image: string | null;
  images: string[];
  location: string;
  boatType: string;
  length: number;
  capacity: number;
  motor: string | null;
  fuelCapacity: string | null;
  features: string[];
  description: string | null;
  notes: string | null;
  dockInstructions: string | null;
  fare: number;
  status: string;
  badge: string | null;
  includedWithMembership: boolean;
  lastBooked: string | null;
}

export interface CalendarDay {
  day: number;
  available: boolean;
  boatsCount: number;
}

export interface CalendarAvailability {
  month: number;
  year: number;
  days: CalendarDay[];
}

/**
 * Get all boats with filters
 */
export async function fetchBoats(filters: BoatFilters = {}): Promise<BoatListResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.date) params.append('date', filters.date);
  if (filters.location) {
    const locations = Array.isArray(filters.location) ? filters.location : [filters.location];
    locations.forEach(loc => params.append('location', loc));
  }
  if (filters.boat_type) {
    const types = Array.isArray(filters.boat_type) ? filters.boat_type : [filters.boat_type];
    types.forEach(type => params.append('boat_type', type));
  }
  if (filters.length_min) params.append('length_min', filters.length_min.toString());
  if (filters.length_max) params.append('length_max', filters.length_max.toString());
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.order) params.append('order', filters.order);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.per_page) params.append('per_page', filters.per_page.toString());

  const queryString = params.toString();
  const endpoint = `/api/fleets${queryString ? '?' + queryString : ''}`;

  return apiCall<BoatListResponse>(endpoint);
}

/**
 * Get single boat details
 */
export async function fetchBoat(id: number): Promise<Boat> {
  return apiCall<Boat>(`/api/fleets/${id}`);
}

/**
 * Get calendar availability
 */
export async function fetchCalendarAvailability(
  month: number,
  year: number,
  location?: string,
  boat_type?: string
): Promise<CalendarAvailability> {
  const params = new URLSearchParams({
    month: month.toString(),
    year: year.toString(),
  });

  if (location) params.append('location', location);
  if (boat_type) params.append('boat_type', boat_type);

  const queryString = params.toString();
  return apiCall<CalendarAvailability>(
    `/api/calendar-availability?${queryString}`
  );
}

/**
 * Get boat locations for filter
 */
export async function fetchBoatLocations(): Promise<{ data: string[] }> {
  return apiCall<{ data: string[] }>('/api/fleets/locations');
}

/**
 * Get boat types for filter
 */
export async function fetchBoatTypes(): Promise<{ data: string[] }> {
  return apiCall<{ data: string[] }>('/api/fleets/types');
}

/**
 * Get boat features for filter
 */
export async function fetchBoatFeatures(): Promise<{ data: string[] }> {
  return apiCall<{ data: string[] }>('/api/fleets/features');
}
