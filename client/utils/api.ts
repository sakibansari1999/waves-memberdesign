// Laravel API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface ApiOptions extends RequestInit {
  auth?: boolean;
}

/**
 * Simple API call wrapper for Laravel backend
 * Automatically includes Bearer token if available
 */
export async function apiCall<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { auth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...fetchOptions.headers,
  };

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

  if (response.status === 401) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
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
  options?: RequestInit,
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
  data: Record<string, unknown>,
): Promise<T> {
  return apiCall<T>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Fleet API Types
 */

export type BookingTypeValue = "AM" | "PM" | "FULL_DAY";
export type SlotFilterValue = "AM" | "PM" | "FULL_DAY" | "full-day";

export interface BoatFilters {
  search?: string;
  date?: string;
  slot?: SlotFilterValue | string;
  location?: string | string[];
  boat_type?: string | string[];
  length_min?: number;
  length_max?: number;
  features?: string | string[];
  sort?: "boat_name" | "capacity" | "length" | "created_at" | string;
  order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface BoatAvailabilityItem {
  available: boolean;
  waitlist: boolean;
  label: string;
}

export interface BoatAvailability {
  AM?: BoatAvailabilityItem;
  PM?: BoatAvailabilityItem;
  FULL_DAY?: BoatAvailabilityItem;
}

export interface Boat {
  id: number;
  boat_name: string;
  name?: string;

  type: string;
  category?: string;
  boatType: string;

  image: string | null;
  images: string[];

  location: string;
  dock_location?: string;
  boat_address?: string | null;

  length: number | null;
  capacity: number | null;
  guests?: number | null;

  weight_capacity?: number | null;
  weightCapacity?: number | null;

  fuel_capacity?: number | null;
  fuelCapacity?: number | null;

  motor: string | null;
  engine_type?: string | null;
  motor_year?: string | number | null;
  model_number?: string | null;

  registration_number?: string | null;
  serial_number?: string | null;
  hull_number?: string | null;

  city?: string | null;
  country?: string | null;
  zipcode?: string | null;

  features: string[];

  description: string | null;
  notes: string | null;
  additional_notes?: string | null;
  dockInstructions: string | null;

  fare?: number | null;
  status: string;
  badge: "most-booked" | "unavailable" | null | string;
  includedWithMembership: boolean;

  lastBooked: string | null;
  lastBookedFormatted?: string | null;

  availability?: BoatAvailability | null;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface BoatListResponse {
  success?: boolean;
  message?: string;
  data: Boat[];
  pagination: PaginationMeta;
  filters?: Record<string, unknown>;
}

export interface SingleBoatResponse {
  success?: boolean;
  message?: string;
  data: Boat;
}

export interface CalendarDay {
  day: number;
  date?: string;
  available: boolean;
  boatsCount: number;
  unavailableCount?: number;
}

export interface CalendarAvailability {
  month: number;
  year: number;
  days: CalendarDay[];
}

export interface CalendarAvailabilityResponse {
  success?: boolean;
  message?: string;
  data: CalendarAvailability;
}

/**
 * Fleet API Calls
 */

export async function fetchBoats(
  filters: BoatFilters = {},
): Promise<BoatListResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.date) params.append("date", filters.date);

  if (filters.slot) {
    const mapping: Record<string, string> = {
      AM: "AM",
      PM: "PM",
      FULL_DAY: "FULL_DAY",
      "full-day": "FULL_DAY",
    };

    const mappedBookingType = mapping[filters.slot];
    if (mappedBookingType) {
      params.append("booking_type", mappedBookingType);
    }
  }

  if (filters.location) {
    const locations = Array.isArray(filters.location)
      ? filters.location
      : [filters.location];

    locations.forEach((loc) => {
      if (loc) params.append("location", loc);
    });
  }

  if (filters.boat_type) {
    const types = Array.isArray(filters.boat_type)
      ? filters.boat_type
      : [filters.boat_type];

    types.forEach((type) => {
      if (type) params.append("boat_type", type);
    });
  }

  if (filters.features) {
    const features = Array.isArray(filters.features)
      ? filters.features
      : [filters.features];

    features.forEach((feature) => {
      if (feature) params.append("features[]", feature);
    });
  }

  if (filters.length_min !== undefined && filters.length_min !== null) {
    params.append("length_min", filters.length_min.toString());
  }

  if (filters.length_max !== undefined && filters.length_max !== null) {
    params.append("length_max", filters.length_max.toString());
  }

  if (filters.sort) params.append("sort", filters.sort);
  if (filters.order) params.append("order", filters.order);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.per_page) params.append("per_page", filters.per_page.toString());

  const queryString = params.toString();
  const endpoint = `/api/fleets${queryString ? `?${queryString}` : ""}`;

  return apiCall<BoatListResponse>(endpoint);
}

/**
 * Get single boat details
 */
export async function fetchBoat(id: number): Promise<Boat> {
  const response = await apiCall<SingleBoatResponse>(`/api/fleets/${id}`);
  return response.data;
}

/**
 * Get calendar availability
 */
export async function fetchCalendarAvailability(
  month: number,
  year: number,
  location?: string,
  boat_type?: string,
): Promise<CalendarAvailability> {
  const params = new URLSearchParams({
    month: month.toString(),
    year: year.toString(),
  });

  if (location) params.append("location", location);
  if (boat_type) params.append("boat_type", boat_type);

  const queryString = params.toString();

  const response = await apiCall<CalendarAvailabilityResponse>(
    `/api/calendar-availability?${queryString}`,
  );

  return response.data;
}

/**
 * Get boat locations for filter
 */
export async function fetchBoatLocations(): Promise<{ data: string[] }> {
  return apiCall<{ data: string[] }>("/api/fleets/locations");
}

/**
 * Get boat types for filter
 */
export async function fetchBoatTypes(): Promise<{ data: string[] }> {
  return apiCall<{ data: string[] }>("/api/fleets/types");
}

/**
 * Get boat features for filter
 */
export async function fetchBoatFeatures(): Promise<{ data: string[] }> {
  return apiCall<{ data: string[] }>("/api/fleets/features");
}

/**
 * Reservation API Types
 */

export interface AvailableDateBookingType {
  available: boolean;
  waitlist: boolean;
  label: string;
}

export interface AvailableDate {
  date: string;
  dayOfWeek: string;
  available: boolean;
  availableSlots: number;
  booking_types?: {
    AM?: AvailableDateBookingType;
    PM?: AvailableDateBookingType;
    FULL_DAY?: AvailableDateBookingType;
  };
}

export interface AvailableDateResponse {
  success?: boolean;
  message?: string;
  data: AvailableDate[];
}

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

export interface AvailableTimesResponse {
  success?: boolean;
  message?: string;
  data: TimeSlot[];
  meta?: {
    booking_type: BookingTypeValue;
    booking_type_label?: string;
    due_time: string;
    due_time_formatted: string;
    is_waitlist?: boolean;
  };
}

export interface Destination {
  id: string;
  name: string;
  description?: string;
}

export interface DestinationsResponse {
  success?: boolean;
  message?: string;
  data: Destination[];
}

export interface BookingMetaResponse {
  success?: boolean;
  message?: string;
  data: {
    booking_types: Array<{
      value: BookingTypeValue;
      label: string;
    }>;
    member_phone?: string | null;
  };
}

export interface BookingPayload {
  fleet_id: number;
  start_date: string;
  booking_type?: BookingTypeValue;
  start_time: string;
  duration_hours?: number;
  destination?: string;
  driver_requested?: boolean;
  customer_notes?: string;
  member_phone?: string;
  total_passengers?: number;
  children_details?: string;
}

export interface ReservationData {
  id: number;
  booking_code: string;
  fleet_id: number;
  member_id: number;

  start_date: string;
  start_date_formatted?: string;

  start_time: string;
  start_time_formatted?: string;

  end_date?: string;
  end_time?: string;

  due_time?: string;
  due_time_formatted?: string;

  booking_type?: BookingTypeValue;
  booking_type_label?: string;
  duration_label?: string;

  duration_hours?: number;
  destination?: string | null;
  driver_requested?: boolean;
  customer_notes?: string | null;

  member_phone?: string | null;
  total_passengers?: number | null;
  children_details?: string | null;

  location?: string | null;
  status: string;

  created_at: string;
  updated_at: string;
}

export interface ReservationResponse {
  success?: boolean;
  message?: string;
  data: ReservationData;
}

export interface AvailabilityCheck {
  available: boolean;
  message: string;
  conflicting_reservation: number | null;
}

/**
 * Get booking meta
 */
export async function fetchBookingMeta(): Promise<BookingMetaResponse> {
  return apiCall<BookingMetaResponse>("/api/reservations/booking-meta");
}

/**
 * Get available dates for a specific boat
 */
export async function fetchAvailableDates(
  fleetId: number,
  month?: number,
  year?: number,
): Promise<AvailableDateResponse> {
  const params = new URLSearchParams({
    fleet_id: fleetId.toString(),
  });

  if (month) params.append("month", month.toString());
  if (year) params.append("year", year.toString());

  const queryString = params.toString();

  return apiCall<AvailableDateResponse>(
    `/api/reservations/available-dates?${queryString}`,
  );
}

/**
 * Get available time slots for a boat and date
 */
export async function fetchAvailableTimes(
  fleetId: number,
  date: string,
  bookingType?: BookingTypeValue,
): Promise<AvailableTimesResponse> {
  const params = new URLSearchParams({
    fleet_id: fleetId.toString(),
    date,
  });

  if (bookingType) {
    params.append("booking_type", bookingType);
  }

  return apiCall<AvailableTimesResponse>(
    `/api/reservations/available-times?${params.toString()}`,
  );
}

/**
 * Get list of destinations
 */
export async function fetchDestinations(): Promise<DestinationsResponse> {
  return apiCall<DestinationsResponse>("/api/reservations/destinations");
}

/**
 * Check availability for a specific time slot
 */
export async function checkAvailability(
  fleetId: number,
  date: string,
  startTime: string,
  durationHours: number,
): Promise<AvailabilityCheck> {
  const params = new URLSearchParams({
    fleet_id: fleetId.toString(),
    date,
    start_time: startTime,
    duration_hours: durationHours.toString(),
  });

  return apiCall<AvailabilityCheck>(
    `/api/reservations/check-availability?${params.toString()}`,
  );
}

/**
 * Create a reservation (booking)
 */
export async function createReservation(
  payload: BookingPayload,
): Promise<ReservationResponse> {
  return apiCall<ReservationResponse>("/api/reservations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Get reservation details
 */
export async function fetchReservation(
  id: number,
): Promise<ReservationResponse> {
  return apiCall<ReservationResponse>(`/api/reservations/${id}`);
}

/**
 * My Bookings API Types
 */

export interface FleetInfo {
  id: number;
  boat_name: string;
  type: string;
  dock_location: string;
  image: string | null;
  capacity: number;
  length: number;
  fare: number;
}

export interface MyBooking {
  id: number;
  booking_code: string;
  fleet_id: number;
  member_id: number;
  location: string;
  destination?: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  duration_hours: number;
  driver_requested: boolean;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  customer_notes?: string;
  created_at: string;
  fleet: FleetInfo;
}

export interface MyBookingsResponse {
  success?: boolean;
  message?: string;
  data: MyBooking[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

/**
 * Get current user's bookings with optional status filter
 */
export async function fetchMyBookings(
  status?: string,
): Promise<MyBookingsResponse> {
  const params = new URLSearchParams();

  if (status) {
    params.append("status", status);
  }

  const queryString = params.toString();
  const endpoint = `/api/my-bookings${queryString ? `?${queryString}` : ""}`;

  return apiCall<MyBookingsResponse>(endpoint);
}