import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAvailableDates,
  useAvailableTimes,
  useDestinations,
  useCreateReservation,
  useFetchReservation,
} from "@/hooks/useReservation";
import { Boat } from "@/utils/api";

interface BookingData {
  date: string;
  startTime: string;
  duration: string;
  endTime: string;
  destination: string;
  driverRequired: "yes" | "no";
  notes: string;
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
    startTime: "",
    duration: "04",
    endTime: "",
    destination: "",
    driverRequired: "no",
    notes: "",
  });

  const [createdReservationId, setCreatedReservationId] = useState<number | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Fetch available dates
  const { data: availableDatesData, isLoading: datesLoading, error: datesError } = useAvailableDates(
    boat?.id || null
  );

  // Fetch available times when date is selected
  const { data: availableTimesData, isLoading: timesLoading } = useAvailableTimes(
    boat?.id || null,
    bookingData.date || null
  );

  // Fetch destinations
  const { data: destinationsData, isLoading: destinationsLoading } = useDestinations();

  // Create reservation mutation
  const { mutate: submitBooking, isPending: isSubmitting } = useCreateReservation();

  // Fetch reservation after creation
  const { data: reservationData, isLoading: reservationLoading } = useFetchReservation(
    createdReservationId
  );

  if (!boat) {
    navigate("/");
    return null;
  }

  // Format duration hours (e.g., "04" to 4)
  const durationHours = parseInt(bookingData.duration) || 4;

  const handleInputChange = (
    field: keyof BookingData,
    value: string | "yes" | "no",
  ) => {
    setBookingError(null);
    setBookingData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate end time when start time or duration changes
      if (field === "startTime" || field === "duration") {
        const startTime = field === "startTime" ? value : prev.startTime;
        const duration = field === "duration" ? value : prev.duration;

        if (startTime && duration) {
          const [hours, minutes] = startTime.split(":").map(Number);
          const durationHours = parseInt(duration);
          const endHour = (hours + durationHours) % 24;
          updated.endTime = `${String(endHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        }
      }

      return updated;
    });
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!bookingData.date || !bookingData.startTime || !bookingData.duration) {
        setBookingError("Please fill in all required fields");
        return;
      }
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      // Submit booking
      submitBooking(
        {
          fleet_id: boat.id,
          start_date: bookingData.date,
          start_time: bookingData.startTime,
          duration_hours: durationHours,
          destination: bookingData.destination || undefined,
          driver_requested: bookingData.driverRequired === "yes",
          customer_notes: bookingData.notes || undefined,
        },
        {
          onSuccess: (data) => {
            setCreatedReservationId(data.data.id);
            setStep(3);
            window.scrollTo(0, 0);
          },
          onError: (error: any) => {
            setBookingError(
              error?.message || "Failed to create booking. Please try again."
            );
          },
        }
      );
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
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
        {/* Step Indicator */}
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

        {/* Main Content Container */}
        <div className="max-w-[680px] mx-auto">
          {/* Step 1: Booking Details */}
          {step === 1 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Boat Info Header */}
              <div className="flex items-center gap-4 p-6 border-b border-gray-200">
                <img
                  src={boat.images?.[0] || boat.image}
                  alt={boat.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-gray-900 text-lg font-semibold mb-1">
                    {boat.name}
                  </h2>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-gray-900 text-sm">{boat.type}</span>
                    <span className="w-1 h-1 bg-gray-900 rounded-full"></span>
                    <span className="text-gray-900 text-sm">
                      {boat.category}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs">{boat.id}</div>
                </div>
                {boat.includedWithMembership && (
                  <div className="px-2 py-1 rounded-lg border border-blue-primary/64 bg-blue-primary/11">
                    <span className="text-blue-primary text-xs">Included</span>
                  </div>
                )}
              </div>

              {/* Boat Quick Info */}
              <div className="flex items-center gap-6 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 text-sm">{boat.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 text-sm">
                    {boat.guests} Guests
                  </span>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-6">
                <h3 className="text-gray-900 text-xl font-semibold mb-6">
                  Select Date & Time
                </h3>

                <div className="space-y-6">
                  {/* Error Message */}
                  {bookingError && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{bookingError}</p>
                    </div>
                  )}

                  {/* Date and Start Time Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-gray-900 text-sm">
                        Date *
                      </Label>
                      {datesLoading ? (
                        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
                      ) : datesError ? (
                        <div className="text-red-600 text-sm">Failed to load dates</div>
                      ) : (
 <Select
  value={bookingData.date}
  onValueChange={(value) =>
    handleInputChange("date", value)
  }
>
  <SelectTrigger
    id="date"
    className="bg-white border-gray-300"
  >
    <SelectValue placeholder="Select Date" />
  </SelectTrigger>

  <SelectContent>
    {availableDatesData?.data
      ?.filter((dateOption) => {
        // safer parsing (avoids timezone shift)
        const dateObj = new Date(dateOption.date + "T00:00:00");
        dateObj.setHours(0, 0, 0, 0);

        // show only today → +30 days
        return dateObj >= today && dateObj <= maxDate;
      })
      .map((dateOption) => {
        const dateObj = new Date(dateOption.date + "T00:00:00");

        return (
          <SelectItem
            key={dateOption.date}
            value={dateOption.date}
            disabled={!dateOption.available}
          >
            {dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            {!dateOption.available ? " (Unavailable)" : ""}
          </SelectItem>
        );
      })}
  </SelectContent>
</Select>

                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="startTime"
                        className="text-gray-900 text-sm"
                      >
                        Start Time *
                      </Label>
                      {!bookingData.date ? (
                        <div className="h-10 bg-gray-100 rounded-md flex items-center px-3 text-gray-500 text-sm">
                          Select a date first
                        </div>
                      ) : timesLoading ? (
                        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
                      ) : (
                        <Select
                          value={bookingData.startTime}
                          onValueChange={(value) =>
                            handleInputChange("startTime", value)
                          }
                        >
                          <SelectTrigger
                            id="startTime"
                            className="bg-white border-gray-300"
                          >
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimesData?.data?.map((timeSlot) => (
                              <SelectItem
                                key={timeSlot.time}
                                value={timeSlot.time}
                                disabled={!timeSlot.available}
                              >
                                {timeSlot.label}
                                {!timeSlot.available && ' (Booked)'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  {/* Duration and End Time Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="duration"
                        className="text-gray-900 text-sm"
                      >
                        Duration (Hours) *
                      </Label>
                      <Select
                        value={bookingData.duration}
                        onValueChange={(value) =>
                          handleInputChange("duration", value)
                        }
                      >
                        <SelectTrigger
                          id="duration"
                          className="bg-white border-gray-300"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="3">3 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="5">5 hours</SelectItem>
                          <SelectItem value="6">6 hours</SelectItem>
                          <SelectItem value="8">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="endTime"
                        className="text-gray-900 text-sm"
                      >
                        End Time (Auto)
                      </Label>
                      <Input
                        id="endTime"
                        value={bookingData.endTime || "--:--"}
                        readOnly
                        className="bg-gray-50 border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="destination"
                      className="text-gray-900 text-sm"
                    >
                      Destination (Optional)
                    </Label>
                    {destinationsLoading ? (
                      <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
                    ) : (
                      <Select
                        value={bookingData.destination}
                        onValueChange={(value) =>
                          handleInputChange("destination", value)
                        }
                      >
                        <SelectTrigger
                          id="destination"
                          className="bg-white border-gray-300"
                        >
                          <SelectValue placeholder="Where would you like to go" />
                        </SelectTrigger>
                        <SelectContent>
                          {destinationsData?.data?.map((dest) => (
                            <SelectItem key={dest.id} value={dest.id}>
                              {dest.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Driver Required */}
                  <div className="space-y-2">
                    <Label className="text-gray-900 text-sm">
                      Driver Required?
                    </Label>
                    <RadioGroup
                      value={bookingData.driverRequired}
                      onValueChange={(value: "yes" | "no") =>
                        handleInputChange("driverRequired", value)
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="driver-no" />
                        <Label
                          htmlFor="driver-no"
                          className="text-gray-900 text-sm font-normal cursor-pointer"
                        >
                          No, I'll drive
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="driver-yes" />
                        <Label
                          htmlFor="driver-yes"
                          className="text-gray-900 text-sm font-normal cursor-pointer"
                        >
                          Yes, provide driver
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-900 text-sm">
                      Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requests..."
                      value={bookingData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      className="bg-white border-gray-300 min-h-[100px] resize-none"
                    />
                  </div>

                  {/* Continue Button */}
                  <Button
                    onClick={handleContinue}
                    disabled={!bookingData.date || !bookingData.startTime || !bookingData.duration || datesLoading || timesLoading}
                    className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white py-6 text-base font-semibold"
                  >
                    {datesLoading || timesLoading ? "Loading..." : "Continue"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Booking Summary */}
          {step === 2 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Boat Info Header */}
              <div className="flex items-center gap-4 p-6 border-b border-gray-200">
                <img
                  src={boat.images?.[0] || boat.image}
                  alt={boat.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-gray-900 text-lg font-semibold mb-1">
                    {boat.name}
                  </h2>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-gray-900 text-sm">{boat.type}</span>
                    <span className="w-1 h-1 bg-gray-900 rounded-full"></span>
                    <span className="text-gray-900 text-sm">
                      {boat.category}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs">{boat.id}</div>
                </div>
                {boat.includedWithMembership && (
                  <div className="px-2 py-1 rounded-lg border border-blue-primary/64 bg-blue-primary/11">
                    <span className="text-blue-primary text-xs">Included</span>
                  </div>
                )}
              </div>

              {/* Boat Quick Info */}
              <div className="flex items-center gap-6 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 text-sm">{boat.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 text-sm">
                    {boat.guests} Guests
                  </span>
                </div>
              </div>

              {/* Review Section */}
              <div className="p-6">
                <h3 className="text-gray-900 text-xl font-semibold mb-6">
                  Review your booking
                </h3>

                {/* Booking Details Grid */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Date</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {new Date(bookingData.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Time</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {bookingData.startTime} - {bookingData.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Duration</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {durationHours} hour{durationHours !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Destination</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {bookingData.destination
                        ? destinationsData?.data?.find(d => d.id === bookingData.destination)?.name || 'Not specified'
                        : 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Driver</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {bookingData.driverRequired === "yes"
                        ? "Provided by Company"
                        : "Self Drive"}
                    </span>
                  </div>
                </div>

                {/* Membership Info */}
                <div className="flex items-start gap-3 p-4 bg-blue-primary/5 rounded-lg border border-blue-primary/20 mb-4">
                  <svg
                    className="w-5 h-5 text-blue-primary flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                    <p className="text-gray-600 text-xs">
                      Included with Membership
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
                    No Charge
                  </span>
                </div>

                {/* Post-Trip Billing Info */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-6">
                  <Info className="w-5 h-5 text-blue-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-gray-900 text-sm font-semibold mb-1">
                      Post-Trip Billing
                    </h4>
                    <p className="text-gray-600 text-xs">
                      No payment is required now. Fuel and usage charges will be
                      billed after your trip based on actual consumption.
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {bookingError && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{bookingError}</p>
                  </div>
                )}

                {/* Confirm Button */}
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

          {/* Step 3: Booking Confirmed */}
          {step === 3 && (
            <div className="text-center">
              {reservationLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary"></div>
                    <p className="mt-2 text-gray-600">Confirming your booking...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Success Icon */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-green-500/10 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Success Message */}
                  <div className="mb-8">
                    <h2 className="text-gray-900 text-2xl font-bold mb-4">
                      Booking Confirmed!
                    </h2>
                    <p className="text-gray-500 text-base">Your adventure awaits</p>
                  </div>

                  {/* Booking Details Card */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
                    {/* Booking ID */}
                    <div className="text-center mb-6 pb-6 border-b border-gray-100">
                      <h3 className="text-gray-500 text-xl font-medium mb-2">
                        Booking ID
                      </h3>
                      <p className="text-blue-primary text-2xl font-bold">
                        {reservationData?.data?.booking_code || bookingError}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-4 text-left">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Boat</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {boat.boat_name}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Date</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {new Date(reservationData?.data?.start_date || bookingData.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Time</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {reservationData?.data?.start_time} - {reservationData?.data?.end_time}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Location</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {boat.location}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Duration</span>
                        <span className="text-gray-900 text-sm font-semibold">
                          {reservationData?.data?.duration_hours} hour{reservationData?.data?.duration_hours !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 text-sm">Status</span>
                        <span className="px-2 py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-medium">
                          {reservationData?.data?.status?.charAt(0).toUpperCase() + reservationData?.data?.status?.slice(1) || 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mt-6">
                      <Info className="w-5 h-5 text-blue-primary flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 text-xs text-left">
                        No payment is required now. Fuel and usage charges will be
                        billed after your trip based on actual consumption.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate("/my-trips")}
                      className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white py-6 text-base font-semibold"
                    >
                      View booking details
                    </Button>
                    <Button
                      onClick={() => navigate("/boats")}
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
