import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import {
  MapPin,
  Users,
  Info,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  Clock3,
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
  capacity?: number;
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
    booking_types?: {
      AM?: {
        available: boolean;
        waitlist: boolean;
        label: string;
      };
      PM?: {
        available: boolean;
        waitlist: boolean;
        label: string;
      };
      FULL_DAY?: {
        available: boolean;
        waitlist: boolean;
        label: string;
      };
    };
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
    booking_type_label?: string;
    due_time: string;
    due_time_formatted: string;
    is_waitlist?: boolean;
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
    member_phone?: string | null;
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
    member_phone?: string | null;
    total_passengers?: number | null;
    children_details?: string | null;
  };
}

interface BookingData {
  date: string;
  bookingType: "AM" | "PM" | "FULL_DAY" | "";
  startTime: string;
  destination: string;
  notes: string;
  memberPhone: string;
  totalPassengers: string;
  childrenDetails: string;
}

type BookingTypeValue = "AM" | "PM" | "FULL_DAY";

function toLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toApiDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function formatPhoneCapacityText(capacity: number) {
  return `Capacity is ${capacity}`;
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

  useEffect(() => {
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
  const bookingState = location.state as
    | {
      boat?: Boat;
      selectedDate?: string;
      slot?: "AM" | "PM" | "FULL_DAY" | "full-day" | "";
    }
    | undefined;

  const boat = bookingState?.boat;
  const preselectedDate = bookingState?.selectedDate || "";
  const preselectedSlotRaw = bookingState?.slot || "";

  const preselectedSlot: "AM" | "PM" | "FULL_DAY" | "" =
    preselectedSlotRaw === "full-day"
      ? "FULL_DAY"
      : preselectedSlotRaw === "AM" ||
        preselectedSlotRaw === "PM" ||
        preselectedSlotRaw === "FULL_DAY"
        ? preselectedSlotRaw
        : "";

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
    date: preselectedDate,
    bookingType: preselectedSlot,
    startTime: "",
    destination: "",
    notes: "",
    memberPhone: "",
    totalPassengers: "",
    childrenDetails: "",
  });
    const selectedBookingDate = bookingData.date
    ? toLocalDate(bookingData.date)
    : undefined;


const [calendarMonth, setCalendarMonth] = useState<Date>(
  selectedBookingDate ?? today
);
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
  const boatCapacity = Number(boat.guests ?? boat.capacity ?? 0);

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

  useEffect(() => {
    const phone = bookingMeta.data?.data?.member_phone || "";
    if (!phone) return;

    setBookingData((prev) => {
      if (prev.memberPhone) return prev;
      return { ...prev, memberPhone: phone };
    });
  }, [bookingMeta.data?.data?.member_phone]);
useEffect(() => {
  if (!bookingData.date) return;

  const nextMonth = toLocalDate(bookingData.date);

  setCalendarMonth((prev) => {
    if (
      prev.getFullYear() === nextMonth.getFullYear() &&
      prev.getMonth() === nextMonth.getMonth()
    ) {
      return prev;
    }

    return nextMonth;
  });
}, [bookingData.date]);
  const fetchCreatedReservation = async (reservationId: number) => {
    const data = await apiFetch<ReservationResponse>(`/api/reservations/${reservationId}`);
    setCreatedReservation(data.data);
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingError(null);

    setBookingData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "date") {
        updated.bookingType = "";
        updated.startTime = "";
      }

      if (field === "bookingType") {
        updated.startTime = "";
      }

      return updated;
    });
  };

  const selectedDateMeta = useMemo(() => {
    return (
      availableDates.data?.data?.find((item) => item.date === bookingData.date) || null
    );
  }, [availableDates.data, bookingData.date]);

  const bookingTypeCards = useMemo(() => {
    const meta = selectedDateMeta?.booking_types;

    return [
      {
        value: "AM" as BookingTypeValue,
        label: meta?.AM?.label || "AM",
        isWaitlist: meta?.AM?.waitlist || false,
        isDisabled: !bookingData.date,
      },
      {
        value: "PM" as BookingTypeValue,
        label: meta?.PM?.label || "PM",
        isWaitlist: meta?.PM?.waitlist || false,
        isDisabled: !bookingData.date,
      },
      {
        value: "FULL_DAY" as BookingTypeValue,
        label: meta?.FULL_DAY?.label || "Full Day",
        isWaitlist: meta?.FULL_DAY?.waitlist || false,
        isDisabled: !bookingData.date,
      },
    ];
  }, [selectedDateMeta, bookingData.date]);

  const selectedDestinationName =
    bookingData.destination
      ? destinations.data?.data?.find((d) => d.id === bookingData.destination)?.name ||
      "Not specified"
      : "Not specified";

  const dueTimeFormatted = availableTimes.data?.meta?.due_time_formatted || "--:--";
  const isWaitlistSelected = !!availableTimes.data?.meta?.is_waitlist;
  const selectedBookingTypeLabel =
    availableTimes.data?.meta?.booking_type_label ||
    bookingMeta.data?.data?.booking_types?.find(
      (t) => t.value === bookingData.bookingType
    )?.label ||
    bookingData.bookingType ||
    "—";

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




  const startTimeLabel =
    availableTimes.data?.data?.find((t) => t.time === bookingData.startTime)?.label ||
    bookingData.startTime ||
    "—";

  const validateStepOne = () => {
    if (!bookingData.date || !bookingData.bookingType || !bookingData.startTime) {
      setBookingError("Please fill in all required booking fields.");
      return false;
    }

    if (!bookingData.memberPhone.trim()) {
      setBookingError("Please enter contact phone number.");
      return false;
    }

    if (!bookingData.totalPassengers.trim()) {
      setBookingError("Please enter total number of passengers.");
      return false;
    }

    const passengerCount = Number(bookingData.totalPassengers);

    if (!Number.isInteger(passengerCount) || passengerCount < 1) {
      setBookingError("Total number of passengers must be at least 1.");
      return false;
    }

    if (boatCapacity > 0 && passengerCount > boatCapacity) {
      setBookingError(`Total passengers exceed boat capacity of ${boatCapacity}.`);
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if (step === 1) {
      if (!validateStepOne()) return;

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
            member_phone: bookingData.memberPhone.trim(),
            total_passengers: Number(bookingData.totalPassengers),
            children_details: bookingData.childrenDetails || undefined,
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

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="max-w-[900px] mx-auto px-4 md:px-5 py-6">
        {step !== 3 && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold border transition-all",
                step === 1
                  ? "bg-blue-primary text-white border-blue-primary"
                  : "bg-white text-gray-500 border-gray-300"
              )}
            >
              1
            </div>
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold border transition-all",
                step === 2
                  ? "bg-blue-primary text-white border-blue-primary"
                  : "bg-white text-gray-500 border-gray-300"
              )}
            >
              2
            </div>
          </div>
        )}

        <div className="max-w-[860px] mx-auto">
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-start gap-3 px-5 md:px-6 py-5 border-b border-gray-200">
                <img
                  src={boatImage}
                  alt={boatName}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h2 className="text-[#171A22] text-[18px] md:text-[20px] font-bold mb-1">
                    {boatName}
                  </h2>

                  <div className="text-gray-500 text-[14px]">
                    {[boat.type, boat.category].filter(Boolean).join(" • ") || "Boat"}
                  </div>
                </div>

                {boat.includedWithMembership && (
                  <div className="px-3 py-1.5 rounded-lg border border-blue-primary/20 bg-blue-primary/5">
                    <span className="text-blue-primary text-[14px] font-medium">
                      Included
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 md:px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 text-[15px]">{boatLocation}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 text-[15px]">
                    {boatCapacity || 0} Guests
                  </span>
                </div>
              </div>

              <div className="px-5 md:px-6 py-5">
                <h3 className="text-[#171A22] text-[20px] font-semibold mb-6">
                  Select Date & Time
                </h3>

                {bookingError && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg mb-5">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{bookingError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div className="space-y-2">
  <Label className="text-[#171A22] text-[14px] font-semibold">
    Date *
  </Label>

  {availableDates.isLoading ? (
    <div className="h-[320px] bg-gray-100 rounded-lg animate-pulse" />
  ) : availableDates.error ? (
    <div className="text-red-600 text-sm">Failed to load dates</div>
  ) : (
    <div className="rounded-lg border border-gray-300 bg-white p-2">
     <Calendar
  mode="single"
  month={calendarMonth}
  onMonthChange={setCalendarMonth}
  selected={selectedBookingDate}
  onSelect={(date) => {
    if (!date) return;

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const apiDate = toApiDate(normalizedDate);
    handleInputChange("date", apiDate);
  }}
  className="w-full"
  initialFocus
/>
    </div>
  )}

  {bookingData.date && (
    <div className="text-[13px] text-gray-500">
      Selected: {format(selectedBookingDate as Date, "MM/dd/yyyy")}
    </div>
  )}
</div>

                  <div>
                    <Label className="text-[#171A22] text-[14px] font-semibold mb-3 block">
                      Reservation Type *
                    </Label>

                    <div className="space-y-2 mb-2">
                      {bookingTypeCards.map((item) => {
                        const isSelected = bookingData.bookingType === item.value;

                        return (
                          <button
                            key={item.value}
                            type="button"
                            disabled={item.isDisabled}
                            onClick={() => handleInputChange("bookingType", item.value)}
                            className={cn(
                              "w-full min-h-[48px] rounded-lg border px-4 flex items-center justify-between text-left transition-all text-[14px]",
                              item.isDisabled
                                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                : isSelected
                                  ? "bg-blue-primary text-white border-blue-primary"
                                  : item.isWaitlist
                                    ? "bg-[#F3F4F8] text-gray-600 border-gray-200"
                                    : "bg-white text-[#171A22] border-gray-200 hover:border-blue-primary/40"
                            )}
                          >
                            <span className="font-medium">{item.label}</span>

                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : item.isWaitlist ? (
                              <Clock3 className="w-4 h-4 text-gray-500" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-start gap-2 text-gray-500 mb-5 pl-1">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-[13px]">
                        Due back At or before {dueTimeFormatted === "--:--" ? "—" : dueTimeFormatted}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startTime" className="text-[#171A22] text-[14px] font-semibold">
                        Start Time *
                      </Label>

                      {!bookingData.date || !bookingData.bookingType ? (
                        <div className="h-11 bg-gray-100 rounded-lg flex items-center px-3 text-gray-500 text-sm border border-gray-200">
                          Select date and booking type first
                        </div>
                      ) : availableTimes.isLoading ? (
                        <div className="h-11 bg-gray-100 rounded-lg animate-pulse" />
                      ) : (
                        <Select
                          value={bookingData.startTime}
                          onValueChange={(value) => handleInputChange("startTime", value)}
                        >
                          <SelectTrigger
                            id="startTime"
                            className="h-11 bg-white border-gray-300 rounded-lg text-[14px]"
                          >
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
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="memberPhone" className="text-[#171A22] text-[14px] font-semibold">
                      Contact Phone Number *
                    </Label>
                    <p className="text-gray-500 text-[12px]">
                      Please enter your phone number if different from the one in our system
                    </p>
                    <input
                      id="memberPhone"
                      type="text"
                      value={bookingData.memberPhone}
                      onChange={(e) => handleInputChange("memberPhone", e.target.value)}
                      className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-[14px] outline-none focus:border-blue-primary"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="totalPassengers"
                        className="text-[#171A22] text-[14px] font-semibold"
                      >
                        Total Number of Passengers *
                      </Label>
                      <p className="text-gray-500 text-[12px]">
                        {formatPhoneCapacityText(boatCapacity)}
                      </p>
                      <input
                        id="totalPassengers"
                        type="number"
                        min={1}
                        value={bookingData.totalPassengers}
                        onChange={(e) => handleInputChange("totalPassengers", e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-[14px] outline-none focus:border-blue-primary"
                        placeholder="4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="childrenDetails"
                        className="text-[#171A22] text-[14px] font-semibold"
                      >
                        Ages/Weights of Children
                      </Label>
                      <p className="text-gray-500 text-[12px]">
                        if applicable (eg. 7/45lbs, 3/35lbs, etc)
                      </p>
                      <input
                        id="childrenDetails"
                        type="text"
                        value={bookingData.childrenDetails}
                        onChange={(e) => handleInputChange("childrenDetails", e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-[14px] outline-none focus:border-blue-primary"
                        placeholder="Age/Weight"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-[#171A22] text-[14px] font-semibold">
                      Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requests..."
                      value={bookingData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="bg-white border-gray-300 min-h-[90px] rounded-lg text-[14px] px-3 py-2"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleContinue}
                    disabled={
                      availableDates.isLoading ||
                      availableTimes.isLoading ||
                      bookingMeta.isLoading
                    }
                    className="w-full h-11 rounded-lg bg-blue-primary text-white text-[15px] font-medium"
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
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-start gap-3 px-5 md:px-6 py-5 border-b border-gray-200">
                <img
                  src={boatImage}
                  alt={boatName}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h2 className="text-[#171A22] text-[18px] md:text-[20px] font-bold mb-1">
                    {boatName}
                  </h2>

                  <div className="text-gray-500 text-[14px]">
                    {[boat.type, boat.category].filter(Boolean).join(" • ") || "Boat"}
                  </div>
                </div>

                {boat.includedWithMembership && (
                  <div className="px-3 py-1.5 rounded-lg border border-blue-primary/20 bg-blue-primary/5">
                    <span className="text-blue-primary text-[14px] font-medium">
                      Included
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 md:px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 text-[15px]">{boatLocation}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 text-[15px]">
                    {boatCapacity || 0} Guests
                  </span>
                </div>
              </div>

              <div className="px-5 md:px-6 py-5">
                <h3 className="text-[#171A22] text-[20px] font-semibold mb-6">
                  Review Your Booking
                </h3>

                {isWaitlistSelected && (
                  <div className="flex items-start gap-3 p-3 bg-[#F3F4F8] border border-gray-200 rounded-lg mb-5">
                    <Clock3 className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#171A22] text-sm font-semibold mb-1">
                        {selectedBookingTypeLabel}
                      </p>
                      <p className="text-gray-600 text-sm">
                        This slot type is already reserved. Your booking will be submitted to
                        the waitlist and saved as pending.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-500 text-sm">Date</span>
                    <span className="text-[#171A22] text-sm font-semibold text-right">
                      {bookingData.date
                        ? format(toLocalDate(bookingData.date), "MM/dd/yyyy")
                        : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-500 text-sm">Reservation Type</span>
                    <span className="text-[#171A22] text-sm font-semibold text-right">
                      {selectedBookingTypeLabel}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-500 text-sm">Time</span>
                    <span className="text-[#171A22] text-sm font-semibold text-right">
                      {startTimeLabel} - {dueTimeFormatted}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-500 text-sm">Duration</span>
                    <span className="text-[#171A22] text-sm font-semibold text-right">
                      {bookingData.bookingType === "AM"
                        ? "4 Hours"
                        : bookingData.bookingType === "PM"
                          ? "5 Hours"
                          : bookingData.bookingType === "FULL_DAY"
                            ? "9 Hours"
                            : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-500 text-sm">Destination</span>
                    <span className="text-[#171A22] text-sm font-semibold text-right">
                      {selectedDestinationName}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-500 text-sm">Contact Phone</span>
                    <span className="text-[#171A22] text-sm font-semibold text-right">
                      {bookingData.memberPhone || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-500 text-sm">Passengers</span>
                    <span className="text-[#171A22] text-sm font-semibold text-right">
                      {bookingData.totalPassengers || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-100 gap-4">
                    <span className="text-gray-500 text-sm">Children</span>
                    <span className="text-[#171A22] text-sm font-semibold text-right">
                      {bookingData.childrenDetails || "Not specified"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 gap-4">
                    <span className="text-gray-500 text-sm">Status</span>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border",
                        isWaitlistSelected
                          ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                          : "bg-green-100 border-green-300 text-green-800"
                      )}
                    >
                      {isWaitlistSelected ? "Pending Waitlist" : "Confirmed"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-primary/5 rounded-lg border border-blue-primary/20 mb-4">
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
                    <h4 className="text-[#171A22] text-sm font-semibold mb-1">
                      Gold Membership
                    </h4>
                    <p className="text-gray-600 text-xs">Included with Membership</p>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
                    No Charge
                  </span>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg mb-5">
                  <Info className="w-5 h-5 text-blue-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-[#171A22] text-sm font-semibold mb-1">
                      Post-Trip Billing
                    </h4>
                    <p className="text-gray-600 text-xs">
                      No payment is required now. Fuel and usage charges will be billed
                      after your trip based on actual consumption.
                    </p>
                  </div>
                </div>

                {bookingError && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{bookingError}</p>
                  </div>
                )}

                <div className="flex gap-3 flex-col sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="sm:w-[160px] h-11 rounded-lg border-gray-300 text-[14px]"
                  >
                    Back
                  </Button>

                  <Button
                    type="button"
                    onClick={handleContinue}
                    disabled={isSubmitting}
                    className="flex-1 h-11 rounded-lg bg-blue-primary text-white text-[15px] font-medium"
                  >
                    {isSubmitting
                      ? "Creating Booking..."
                      : isWaitlistSelected
                        ? "Join Waitlist"
                        : "Confirm Booking"}
                  </Button>
                </div>
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
                  <div className="flex items-center justify-center mb-5">
                    <div className="relative">
                      <div
                        className={cn(
                          "w-24 h-24 rounded-full flex items-center justify-center",
                          createdReservation.status === "pending"
                            ? "bg-yellow-500/10"
                            : "bg-green-500/10"
                        )}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            createdReservation.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          )}
                        >
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-[#171A22] text-2xl font-bold mb-3">
                      {createdReservation.status === "pending"
                        ? "Waitlist Booking Submitted!"
                        : "Booking Confirmed!"}
                    </h2>
                    <p className="text-gray-500 text-base">
                      {createdReservation.status === "pending"
                        ? "Your request has been added to the waitlist"
                        : "Your adventure awaits"}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">
                    <div className="text-center mb-5 pb-5 border-b border-gray-100">
                      <h3 className="text-gray-500 text-lg font-medium mb-2">Booking ID</h3>
                      <p className="text-blue-primary text-2xl font-bold">
                        {createdReservation.booking_code}
                      </p>
                    </div>

                    <div className="space-y-3 text-left">
                      <div className="flex justify-between py-2 gap-4">
                        <span className="text-gray-500 text-sm">Boat</span>
                        <span className="text-[#171A22] text-sm font-semibold text-right">
                          {boatName}
                        </span>
                      </div>

                      <div className="flex justify-between py-2 gap-4">
                        <span className="text-gray-500 text-sm">Date</span>
                        <span className="text-[#171A22] text-sm font-semibold text-right">
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

                      <div className="flex justify-between py-2 gap-4">
                        <span className="text-gray-500 text-sm">Time</span>
                        <span className="text-[#171A22] text-sm font-semibold text-right">
                          {createdReservation.start_time_formatted ||
                            createdReservation.start_time}{" "}
                          - {createdReservation.due_time_formatted || dueTimeFormatted}
                        </span>
                      </div>

                      <div className="flex justify-between py-2 gap-4">
                        <span className="text-gray-500 text-sm">Location</span>
                        <span className="text-[#171A22] text-sm font-semibold text-right">
                          {createdReservation.location || boatLocation}
                        </span>
                      </div>

                      <div className="flex justify-between py-2 gap-4">
                        <span className="text-gray-500 text-sm">Reservation Type</span>
                        <span className="text-[#171A22] text-sm font-semibold text-right">
                          {createdReservation.booking_type_label ||
                            createdReservation.booking_type}
                        </span>
                      </div>

                      <div className="flex justify-between py-2 gap-4">
                        <span className="text-gray-500 text-sm">Duration</span>
                        <span className="text-[#171A22] text-sm font-semibold text-right">
                          {createdReservation.duration_label || "—"}
                        </span>
                      </div>

                      <div className="flex justify-between py-2 gap-4">
                        <span className="text-gray-500 text-sm">Contact Phone</span>
                        <span className="text-[#171A22] text-sm font-semibold text-right">
                          {createdReservation.member_phone || bookingData.memberPhone || "—"}
                        </span>
                      </div>

                      <div className="flex justify-between py-2 gap-4">
                        <span className="text-gray-500 text-sm">Passengers</span>
                        <span className="text-[#171A22] text-sm font-semibold text-right">
                          {createdReservation.total_passengers ||
                            bookingData.totalPassengers ||
                            "—"}
                        </span>
                      </div>

                      <div className="flex justify-between py-2 gap-4">
                        <span className="text-gray-500 text-sm">Children</span>
                        <span className="text-[#171A22] text-sm font-semibold text-right">
                          {createdReservation.children_details ||
                            bookingData.childrenDetails ||
                            "Not specified"}
                        </span>
                      </div>

                      <div className="flex justify-between py-2 gap-4">
                        <span className="text-gray-500 text-sm">Status</span>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium border",
                            createdReservation.status === "pending"
                              ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                              : "bg-green-100 border-green-300 text-green-800"
                          )}
                        >
                          {createdReservation.status
                            ? createdReservation.status.charAt(0).toUpperCase() +
                            createdReservation.status.slice(1)
                            : "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg mt-5">
                      <Info className="w-5 h-5 text-blue-primary flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 text-xs text-left">
                        No payment is required now. Fuel and usage charges will be billed
                        after your trip based on actual consumption.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate("/my-reservations")}
                      className="w-full h-11 rounded-lg bg-blue-primary text-white text-[15px] font-medium"
                    >
                      View booking details
                    </Button>
                    <Button
                      onClick={() => navigate("/browse")}
                      variant="outline"
                      className="w-full h-11 rounded-lg border-gray-300 text-gray-900 hover:bg-gray-50 text-[15px] font-medium"
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