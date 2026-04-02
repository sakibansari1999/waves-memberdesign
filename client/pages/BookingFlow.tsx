import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  MapPin,
  Users,
  Info,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Boat {
  id: number;
  boat_name?: string;
  name?: string;
  type?: string;
  category?: string;
  location?: string;
  guests?: number;
  images?: string[];
  image?: string;
  includedWithMembership?: boolean;
}

interface AvailableDatesResponse {
  success?: boolean;
  data: Array<{
    date: string;
    dayOfWeek: string;
    available: boolean;
    availableSlots: number;
  }>;
}

interface AvailableTimesResponse {
  success?: boolean;
  data: Array<{
    time: string;
    label: string;
    available: boolean;
  }>;
  meta?: {
    booking_type: "AM" | "PM" | "FULL_DAY";
    due_time: string;
    due_time_formatted: string;
  };
}

interface DestinationsResponse {
  success?: boolean;
  data: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

interface BookingMetaResponse {
  success?: boolean;
  data: {
    booking_types: Array<{
      value: "AM" | "PM" | "FULL_DAY";
      label: string;
    }>;
  };
}

interface ReservationResponse {
  success?: boolean;
  message?: string;
  data: {
    id: number;
    booking_code: string;
    start_date: string;
    start_date_formatted?: string;
    start_time: string;
    start_time_formatted?: string;
    due_time?: string;
    due_time_formatted?: string;
    booking_type: "AM" | "PM" | "FULL_DAY";
    booking_type_label?: string;
    duration_label?: string;
    location?: string;
    destination?: string | null;
    status?: string;
  };
}

interface BookingData {
  date: string;
  bookingType: "AM" | "PM" | "FULL_DAY" | "";
  startTime: string;
  destination: string;
  notes: string;
}

function toLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toApiDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(API_BASE_URL + url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Something went wrong.");
  }

  return json as T;
}

function useAsyncData<T>(
  enabled: boolean,
  key: string,
  loader: () => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useMemo(() => {
    let cancelled = false;

    if (!enabled) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    loader()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, key]);

  return { data, isLoading, error };
}

export default function BookingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const boat = location.state?.boat as Boat | undefined;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 30);
    return d;
  }, []);

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    date: "",
    bookingType: "",
    startTime: "",
    destination: "",
    notes: "",
  });
  const [createdReservationId, setCreatedReservationId] = useState<number | null>(null);
  const [createdReservation, setCreatedReservation] =
    useState<ReservationResponse["data"] | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!boat) {
    navigate("/");
    return null;
  }

  const boatName = boat.boat_name || boat.name || "Boat";
  const boatImage = boat.images?.[0] || boat.image || "";
  const boatLocation = boat.location || "Location unavailable";

  const bookingMeta = useAsyncData<BookingMetaResponse>(
    true,
    "booking-meta",
    () => apiFetch("/api/reservations/booking-meta")
  );

  const availableDates = useAsyncData<AvailableDatesResponse>(
    !!boat.id,
    `available-dates-${boat.id}`,
    () => apiFetch(`/api/reservations/available-dates?fleet_id=${boat.id}`)
  );

  const availableTimes = useAsyncData<AvailableTimesResponse>(
    !!boat.id && !!bookingData.date && !!bookingData.bookingType,
    `available-times-${boat.id}-${bookingData.date}-${bookingData.bookingType}`,
    () =>
      apiFetch(
        `/api/reservations/available-times?fleet_id=${boat.id}&date=${bookingData.date}&booking_type=${bookingData.bookingType}`
      )
  );

  const destinations = useAsyncData<DestinationsResponse>(
    true,
    "destinations",
    () => apiFetch("/api/reservations/destinations")
  );

  const fetchCreatedReservation = async (reservationId: number) => {
    const data = await apiFetch<ReservationResponse>(`/api/reservations/${reservationId}`);
    setCreatedReservation(data.data);
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingError(null);

    setBookingData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "date") {
        updated.startTime = "";
      }

      if (field === "bookingType") {
        updated.startTime = "";
      }

      return updated;
    });
  };

  const handleContinue = async () => {
    if (step === 1) {
      if (!bookingData.date || !bookingData.bookingType || !bookingData.startTime) {
        setBookingError("Please fill in all required fields");
        return;
      }

      setStep(2);
      window.scrollTo(0, 0);
      return;
    }

    if (step === 2) {
      try {
        setIsSubmitting(true);
        setBookingError(null);

        const response = await apiFetch<ReservationResponse>("/api/reservations", {
          method: "POST",
          body: JSON.stringify({
            fleet_id: boat.id,
            start_date: bookingData.date,
            booking_type: bookingData.bookingType,
            start_time: bookingData.startTime,
            destination: bookingData.destination || undefined,
            customer_notes: bookingData.notes || undefined,
          }),
        });

        setCreatedReservationId(response.data.id);
        setCreatedReservation(response.data);
        await fetchCreatedReservation(response.data.id);
        setStep(3);
        window.scrollTo(0, 0);
      } catch (error: any) {
        setBookingError(error?.message || "Failed to create booking. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    } else {
      navigate(-1);
    }
  };

  const selectedDestinationName =
    bookingData.destination
      ? destinations.data?.data?.find((d) => d.id === bookingData.destination)?.name ||
        "Not specified"
      : "Not specified";

  const dueTimeFormatted = availableTimes.data?.meta?.due_time_formatted || "--:--";

  const selectableDateSet = useMemo(() => {
    const set = new Set<string>();

    availableDates.data?.data
      ?.filter((dateOption) => {
        const dateObj = toLocalDate(dateOption.date);
        dateObj.setHours(0, 0, 0, 0);
        return dateOption.available && dateObj >= today && dateObj <= maxDate;
      })
      .forEach((dateOption) => {
        set.add(dateOption.date);
      });

    return set;
  }, [availableDates.data, today, maxDate]);

  const selectedBookingDate = bookingData.date
    ? toLocalDate(bookingData.date)
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">
              {step === 3 ? "Booking Summary" : "Booking Details"}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-8">
        {step !== 3 && (
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step === 1
                  ? "bg-blue-primary text-white"
                  : "bg-white text-gray-900 border border-gray-300"
              } font-semibold`}
            >
              1
            </div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step === 2
                  ? "bg-blue-primary text-white"
                  : "bg-white text-gray-900 border border-gray-300"
              } font-semibold`}
            >
              2
            </div>
          </div>
        )}

        <div className="max-w-[680px] mx-auto">
          {step === 1 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 p-6 border-b border-gray-200">
                <img
                  src={boatImage}
                  alt={boatName}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-gray-900 text-lg font-semibold mb-1">{boatName}</h2>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-gray-900 text-sm">{boat.type}</span>
                    {boat.category ? (
                      <>
                        <span className="w-1 h-1 bg-gray-900 rounded-full"></span>
                        <span className="text-gray-900 text-sm">{boat.category}</span>
                      </>
                    ) : null}
                  </div>
                  <div className="text-gray-500 text-xs">{boat.id}</div>
                </div>
                {boat.includedWithMembership && (
                  <div className="px-2 py-1 rounded-lg border border-blue-primary/64 bg-blue-primary/11">
                    <span className="text-blue-primary text-xs">Included</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 text-sm">{boatLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 text-sm">{boat.guests ?? 0} Guests</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-gray-900 text-xl font-semibold mb-6">
                  Select Date & Time
                </h3>

                <div className="space-y-6">
                  {bookingError && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{bookingError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-gray-900 text-sm">
                        Date *
                      </Label>

                      {availableDates.isLoading ? (
                        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
                      ) : availableDates.error ? (
                        <div className="text-red-600 text-sm">Failed to load dates</div>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              id="date"
                              className={cn(
                                "w-full justify-start text-left font-normal h-10 bg-white border-gray-300 hover:bg-white",
                                !bookingData.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {bookingData.date
                                ? format(selectedBookingDate as Date, "MM/dd/yyyy")
                                : "MM/DD/YYYY"}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedBookingDate}
                              onSelect={(date) => {
                                if (!date) return;

                                const apiDate = toApiDate(date);
                                if (!selectableDateSet.has(apiDate)) return;

                                handleInputChange("date", apiDate);
                              }}
                              disabled={(date) => {
                                const dateOnly = new Date(date);
                                dateOnly.setHours(0, 0, 0, 0);

                                if (dateOnly < today || dateOnly > maxDate) return true;

                                return !selectableDateSet.has(toApiDate(dateOnly));
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm">Booking Type *</Label>
                      {bookingMeta.isLoading ? (
                        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
                      ) : (
                        <Select
                          value={bookingData.bookingType}
                          onValueChange={(value: "AM" | "PM" | "FULL_DAY") =>
                            handleInputChange("bookingType", value)
                          }
                        >
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Select booking type" />
                          </SelectTrigger>
                          <SelectContent>
                            {bookingMeta.data?.data?.booking_types?.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime" className="text-gray-900 text-sm">
                        Start Time *
                      </Label>

                      {!bookingData.date || !bookingData.bookingType ? (
                        <div className="h-10 bg-gray-100 rounded-md flex items-center px-3 text-gray-500 text-sm">
                          Select date and booking type first
                        </div>
                      ) : availableTimes.isLoading ? (
                        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
                      ) : (
                        <Select
                          value={bookingData.startTime}
                          onValueChange={(value) => handleInputChange("startTime", value)}
                        >
                          <SelectTrigger id="startTime" className="bg-white border-gray-300">
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimes.data?.data?.map((timeSlot) => (
                              <SelectItem
                                key={timeSlot.time}
                                value={timeSlot.time}
                                disabled={!timeSlot.available}
                              >
                                {timeSlot.label}
                                {!timeSlot.available ? " (Booked)" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm">End Time (Auto)</Label>
                      <div className="h-10 bg-gray-50 border border-gray-300 rounded-md px-3 flex items-center text-gray-700 text-sm">
                        {dueTimeFormatted}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-gray-900 text-sm">
                      Destination (Optional)
                    </Label>
                    {destinations.isLoading ? (
                      <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
                    ) : (
                      <Select
                        value={bookingData.destination || "__none__"}
                        onValueChange={(value) =>
                          handleInputChange("destination", value === "__none__" ? "" : value)
                        }
                      >
                        <SelectTrigger id="destination" className="bg-white border-gray-300">
                          <SelectValue placeholder="Where would you like to go" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Not specified</SelectItem>
                          {destinations.data?.data?.map((dest) => (
                            <SelectItem key={dest.id} value={dest.id}>
                              {dest.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-900 text-sm">
                      Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requests..."
                      value={bookingData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="bg-white border-gray-300 min-h-[100px] resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleContinue}
                    disabled={
                      !bookingData.date ||
                      !bookingData.bookingType ||
                      !bookingData.startTime ||
                      availableDates.isLoading ||
                      availableTimes.isLoading
                    }
                    className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white py-6 text-base font-semibold"
                  >
                    {availableDates.isLoading || availableTimes.isLoading
                      ? "Loading..."
                      : "Continue"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 p-6 border-b border-gray-200">
                <img
                  src={boatImage}
                  alt={boatName}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-gray-900 text-lg font-semibold mb-1">{boatName}</h2>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-gray-900 text-sm">{boat.type}</span>
                    {boat.category ? (
                      <>
                        <span className="w-1 h-1 bg-gray-900 rounded-full"></span>
                        <span className="text-gray-900 text-sm">{boat.category}</span>
                      </>
                    ) : null}
                  </div>
                  <div className="text-gray-500 text-xs">{boat.id}</div>
                </div>
                {boat.includedWithMembership && (
                  <div className="px-2 py-1 rounded-lg border border-blue-primary/64 bg-blue-primary/11">
                    <span className="text-blue-primary text-xs">Included</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 text-sm">{boatLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 text-sm">{boat.guests ?? 0} Guests</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-gray-900 text-xl font-semibold mb-6">
                  Review your booking
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Date</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {bookingData.date
                        ? format(toLocalDate(bookingData.date), "MM/dd/yyyy")
                        : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Booking Type</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {bookingMeta.data?.data?.booking_types?.find(
                        (t) => t.value === bookingData.bookingType
                      )?.label || bookingData.bookingType}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Time</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {availableTimes.data?.data?.find((t) => t.time === bookingData.startTime)
                        ?.label || bookingData.startTime}{" "}
                      - {dueTimeFormatted}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Duration</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {bookingData.bookingType === "AM"
                        ? "4 Hours"
                        : bookingData.bookingType === "PM"
                        ? "5 Hours"
                        : bookingData.bookingType === "FULL_DAY"
                        ? "9 Hours"
                        : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Destination</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {selectedDestinationName}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-primary/5 rounded-lg border border-blue-primary/20 mb-4">
                  <svg
                    className="w-5 h-5 text-blue-primary flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10 2L3 7V11C3 14.866 6.134 18 10 18C13.866 18 17 14.866 17 11V7L10 2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-gray-900 text-sm font-semibold mb-1">
                      Gold Membership
                    </h4>
                    <p className="text-gray-600 text-xs">Included with Membership</p>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
                    No Charge
                  </span>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-6">
                  <Info className="w-5 h-5 text-blue-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-gray-900 text-sm font-semibold mb-1">
                      Post-Trip Billing
                    </h4>
                    <p className="text-gray-600 text-xs">
                      No payment is required now. Fuel and usage charges will be billed
                      after your trip based on actual consumption.
                    </p>
                  </div>
                </div>

                {bookingError && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{bookingError}</p>
                  </div>
                )}

                <Button
                  onClick={handleContinue}
                  disabled={isSubmitting}
                  className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white py-6 text-base font-semibold"
                >
                  {isSubmitting ? "Creating Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              {!createdReservationId || !createdReservation ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary"></div>
                    <p className="mt-2 text-gray-600">Confirming your booking...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-green-500/10 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-gray-900 text-2xl font-bold mb-4">
                      Booking Confirmed!
                    </h2>
                    <p className="text-gray-500 text-base">Your adventure awaits</p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="text-center mb-6 pb-6 border-b border-gray-100">
                      <h3 className="text-gray-500 text-xl font-medium mb-2">Booking ID</h3>
                      <p className="text-blue-primary text-2xl font-bold">
                        {createdReservation.booking_code}
                      </p>
                    </div>

                    <div className="space-y-4 text-left">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Boat</span>
                        <span className="text-gray-900 text-sm font-semibold">{boatName}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Date</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {createdReservation.start_date || bookingData.date
                            ? format(
                                toLocalDate(
                                  createdReservation.start_date || bookingData.date
                                ),
                                "MM/dd/yyyy"
                              )
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Time</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {createdReservation.start_time_formatted ||
                            createdReservation.start_time}{" "}
                          - {createdReservation.due_time_formatted || dueTimeFormatted}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Location</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {createdReservation.location || boatLocation}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Booking Type</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {createdReservation.booking_type_label ||
                            createdReservation.booking_type}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Duration</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {createdReservation.duration_label || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Status</span>
                        <span className="px-2 py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-medium">
                          {createdReservation.status
                            ? createdReservation.status.charAt(0).toUpperCase() +
                              createdReservation.status.slice(1)
                            : "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mt-6">
                      <Info className="w-5 h-5 text-blue-primary flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 text-xs text-left">
                        No payment is required now. Fuel and usage charges will be billed
                        after your trip based on actual consumption.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate("/my-trips")}
                      className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white py-6 text-base font-semibold"
                    >
                      View booking details
                    </Button>
                    <Button
                      onClick={() => navigate("/browse")}
                      variant="outline"
                      className="w-full border-gray-300 text-gray-900 hover:bg-gray-50 py-6 text-base font-semibold"
                    >
                      Book another boat
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}