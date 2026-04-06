import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
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
const API_BASE_URL =import.meta.env.VITE_API_BASE_URL
// ── Types ───────────────────────────────────────────────────────────────────

type Tab = "upcoming" | "history" | "cancelled";

interface TripsResponse {
  success: boolean;
  message: string;
  data: {
    counts: {
      upcoming: number;
      history: number;
      cancelled: number;
    };
    tabs: {
      upcoming: ReservationItem[];
      history: ReservationItem[];
      cancelled: ReservationItem[];
    };
  };
}

interface ReservationItem {
  id: number;
  booking_code: string | null;
  status: string;
  status_label: string;
  card_type: "confirmed" | "waitlisted" | "history" | "cancelled" | "default";
  boat: {
    id: number | null;
    name: string | null;
    image_url: string | null;
    dock_location: string | null;
  };
  location: string | null;
  destination: string | null;
  start_date: string | null;
  start_date_formatted: string | null;
  start_time: string | null;
  start_time_formatted: string | null;
  due_time: string | null;
  due_time_formatted: string | null;
  booking_type: "AM" | "PM" | "FULL_DAY" | null;
  booking_type_label: string | null;
  duration_label: string | null;
  can_modify: boolean;
  can_cancel: boolean;
  can_view_receipt: boolean;
  waitlist_position: number | null;
  invoice: {
    id: number;
    invoice_number: string | null;
    status: string;
    total: number;
    paid_date: string | null;
  } | null;
}

interface ReservationDetailResponse {
  success: boolean;
  message: string;
  data: ReservationItem & {
    member?: {
      name?: string | null;
      email?: string | null;
      phone?: string | null;
    };
    customer_notes?: string | null;
    internal_notes?: string | null;
    actual_fuel_charge?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

interface EditMetaResponse {
  success: boolean;
  message: string;
  data: {
    reservation_id: number;
    fleet_id: number;
    boat_name: string | null;
    location: string | null;
    booking_type: "AM" | "PM" | "FULL_DAY";
    due_time: string | null;
    time_slots: Array<{
      time: string;
      label: string;
      available: boolean;
    }>;
    booking_types: Array<{
      value: "AM" | "PM" | "FULL_DAY";
      label: string;
    }>;
  };
}

interface DestinationsResponse {
  success: boolean;
  message?: string;
  data: Array<{
    id: string;
    name: string;
  }>;
}

interface EditFormState {
  start_date: string;
  booking_type: "AM" | "PM" | "FULL_DAY" | "";
  start_time: string;
  destination: string;
  customer_notes: string;
}

// ── API helpers ─────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(API_BASE_URL+url, {
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

function getEditMetaUrl(
  reservationId: number,
  params?: { date?: string; booking_type?: string }
) {
  const search = new URLSearchParams();

  if (params?.date) search.set("date", params.date);
  if (params?.booking_type) search.set("booking_type", params.booking_type);

  const qs = search.toString();
  return `/api/my-trips/${reservationId}/edit-meta${qs ? `?${qs}` : ""}`;
}

// ── Icons ───────────────────────────────────────────────────────────────────

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M11.6673 5.83341C11.6673 8.746 8.43623 11.7793 7.35123 12.7162C7.14359 12.8723 6.85771 12.8723 6.65007 12.7162C5.56507 11.7793 2.33398 8.746 2.33398 5.83341C2.33398 3.25781 4.42505 1.16675 7.00065 1.16675C9.57625 1.16675 11.6673 3.25781 11.6673 5.83341"
        stroke="#6B7280"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 5.8335C5.25 6.79935 6.03415 7.5835 7 7.5835C7.96585 7.5835 8.75 6.79935 8.75 5.8335C8.75 4.86764 7.96585 4.0835 7 4.0835C6.03415 4.0835 5.25 4.86764 5.25 5.8335V5.8335"
        stroke="#6B7280"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M1 6C1 8.75958 3.24042 11 6 11C8.75958 11 11 8.75958 11 6C11 3.24042 8.75958 1 6 1C3.24042 1 1 3.24042 1 6V6"
        stroke="#1D4ED8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 6L5.5 7L7.5 5"
        stroke="#1D4ED8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 3V6L8 7"
        stroke="#C24B28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 6C1 8.75958 3.24042 11 6 11C8.75958 11 11 8.75958 11 6C11 3.24042 8.75958 1 6 1C3.24042 1 1 3.24042 1 6V6"
        stroke="#C24B28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.33398 7.99992H12.6673M8.00065 3.33325V12.6666"
        stroke="white"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2.91602 6.99984H11.0827M6.99935 2.9165L11.0827 6.99984L6.99935 11.0832"
        stroke="#3B63FF"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
        stroke="#111827"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value?: number | null) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatTripTime(item: ReservationItem) {
  if (item.start_time_formatted && item.due_time_formatted) {
    return `${item.start_time_formatted} - ${item.due_time_formatted}`;
  }
  return item.booking_type_label || "—";
}

function getDefaultImage(item: ReservationItem) {
  return item.card_type === "waitlisted"
    ? "from-orange-100 to-orange-200"
    : item.card_type === "history"
    ? "from-slate-200 to-slate-300"
    : "from-blue-100 to-blue-200";
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ConfirmedBadge() {
  return (
    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#EFF6FF]">
      <CheckCircleIcon />
      <span className="text-xs font-semibold text-[#1D4ED8]">Confirmed</span>
    </div>
  );
}

function WaitlistedBadge() {
  return (
    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF0E9]">
      <ClockIcon />
      <span className="text-xs font-semibold text-[#C24B28]">Waitlisted</span>
    </div>
  );
}

function CompletedBadge() {
  return (
    <div className="flex items-center px-3 py-1 rounded-full bg-[#FF7A00]">
      <span className="text-xs font-semibold text-white">Completed</span>
    </div>
  );
}

function CancelledBadge() {
  return (
    <div className="flex items-center px-3 py-1 rounded-full bg-gray-200">
      <span className="text-xs font-semibold text-gray-700">Cancelled</span>
    </div>
  );
}

interface InfoFieldProps {
  label: string;
  value: string;
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-[15px] font-medium text-gray-900">{value}</span>
    </div>
  );
}

interface TabButtonProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

function TabButton({ label, count, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 pb-2 text-sm font-semibold transition-colors",
        active ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
      )}
    >
      {label}
      {count !== undefined && (
        <span className="flex items-center justify-center px-2 py-0.5 rounded-full bg-[#FF7A00] text-xs font-semibold text-gray-900 min-w-[20px]">
          {count}
        </span>
      )}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
      )}
    </button>
  );
}

function StatusBadge({ reservation }: { reservation: ReservationItem }) {
  if (reservation.card_type === "waitlisted") return <WaitlistedBadge />;
  if (reservation.status === "confirmed") return <ConfirmedBadge />;
  if (reservation.status === "completed") return <CompletedBadge />;
  if (reservation.status === "cancelled") return <CancelledBadge />;

  return (
    <div className="flex items-center px-3 py-1 rounded-full bg-gray-100">
      <span className="text-xs font-semibold text-gray-700">
        {reservation.status_label}
      </span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-16 text-gray-500">
      <p className="text-base">{text}</p>
    </div>
  );
}

function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 p-4 sm:p-6 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-black/[0.08] overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-black/[0.08]">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                {subtitle ? (
                  <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                ) : null}
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="px-6 py-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewReservationModal({
  reservationId,
  open,
  onClose,
}: {
  reservationId: number | null;
  open: boolean;
  onClose: () => void;
}) {
  const detailQuery = useQuery({
    queryKey: ["my-trip-detail", reservationId],
    enabled: open && !!reservationId,
    queryFn: () =>
      apiFetch<ReservationDetailResponse>(`/api/my-trips/${reservationId}`),
  });

  const reservation = detailQuery.data?.data;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Reservation Details"
      subtitle={reservation?.booking_code ? `Booking ID: ${reservation.booking_code}` : undefined}
    >
      {detailQuery.isLoading ? (
        <div className="py-10 text-center text-gray-500">Loading reservation...</div>
      ) : detailQuery.isError || !reservation ? (
        <div className="py-10 text-center text-red-600">
          Failed to load reservation details.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-black/[0.08] bg-[#F8FAFC]">
            {reservation.boat.image_url ? (
              <img
                src={reservation.boat.image_url}
                alt={reservation.boat.name || "Boat"}
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200" />
            )}
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900">
                {reservation.boat.name || "Boat"}
              </h4>
              <div className="flex items-center gap-1 mt-1">
                <PinIcon />
                <span className="text-sm text-gray-500">
                  {reservation.location || "Location unavailable"}
                </span>
              </div>
            </div>
            <StatusBadge reservation={reservation} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-black/[0.08] p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Date
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {reservation.start_date_formatted || "—"}
              </div>
            </div>
            <div className="rounded-lg border border-black/[0.08] p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Time
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatTripTime(reservation)}
              </div>
            </div>
            <div className="rounded-lg border border-black/[0.08] p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Reservation Type
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {reservation.booking_type_label || "—"}
              </div>
            </div>
            <div className="rounded-lg border border-black/[0.08] p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Duration
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {reservation.duration_label || "—"}
              </div>
            </div>
            <div className="rounded-lg border border-black/[0.08] p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Destination
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {reservation.destination || "Not specified"}
              </div>
            </div>
            <div className="rounded-lg border border-black/[0.08] p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Fuel Charge
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {reservation.actual_fuel_charge != null
                  ? formatCurrency(reservation.actual_fuel_charge)
                  : "Pending / N.A."}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-black/[0.08] p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Notes
            </div>
            <div className="text-sm text-gray-700">
              {reservation.customer_notes || "No notes added."}
            </div>
          </div>

          {reservation.invoice ? (
            <div className="rounded-lg border border-black/[0.08] p-4 bg-[#F9FAFB]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    Invoice {reservation.invoice.invoice_number || `#${reservation.invoice.id}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Status: {reservation.invoice.status}
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {formatCurrency(reservation.invoice.total)}
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-900"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}

function EditReservationModal({
  reservation,
  open,
  onClose,
}: {
  reservation: ReservationItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<EditFormState>({
    start_date: "",
    booking_type: "",
    start_time: "",
    destination: "",
    customer_notes: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!reservation || !open) return;

    setForm({
      start_date: reservation.start_date || "",
      booking_type: reservation.booking_type || "",
      start_time: reservation.start_time || "",
      destination: reservation.destination || "",
      customer_notes: "",
    });
    setError("");
  }, [reservation, open]);

  const editMetaQuery = useQuery({
    queryKey: [
      "my-trip-edit-meta",
      reservation?.id,
      form.start_date,
      form.booking_type,
    ],
    enabled: open && !!reservation?.id,
    queryFn: () =>
      apiFetch<EditMetaResponse>(
        getEditMetaUrl(reservation!.id, {
          date: form.start_date || undefined,
          booking_type: form.booking_type || undefined,
        })
      ),
  });

  const destinationsQuery = useQuery({
    queryKey: ["reservation-destinations"],
    enabled: open,
    queryFn: () => apiFetch<DestinationsResponse>("/api/reservations/destinations"),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      apiFetch<ReservationDetailResponse>(`/api/my-trips/${reservation!.id}`, {
        method: "PUT",
        body: JSON.stringify({
          start_date: form.start_date,
          booking_type: form.booking_type,
          start_time: form.start_time,
          destination: form.destination || null,
          customer_notes: form.customer_notes || null,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-trips"] });
      queryClient.invalidateQueries({ queryKey: ["my-trip-detail", reservation?.id] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.message || "Failed to update reservation.");
    },
  });

  const bookingTypes = editMetaQuery.data?.data.booking_types || [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
    { value: "FULL_DAY", label: "Full Day" },
  ];

  const timeSlots = editMetaQuery.data?.data.time_slots || [];
  const dueTime = useMemo(() => {
    if (form.booking_type === "AM") return "12:00 PM";
    if (form.booking_type === "PM") return "05:00 PM";
    if (form.booking_type === "FULL_DAY") return "05:00 PM";
    return "—";
  }, [form.booking_type]);

  const handleSubmit = () => {
    setError("");

    if (!form.start_date || !form.booking_type || !form.start_time) {
      setError("Please fill in all required fields.");
      return;
    }

    updateMutation.mutate();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Modify Booking"
      subtitle={
        reservation?.boat.name
          ? `Update your reservation for ${reservation.boat.name}`
          : "Update your reservation"
      }
    >
      {!reservation ? null : editMetaQuery.isLoading ? (
        <div className="py-10 text-center text-gray-500">Loading edit form...</div>
      ) : editMetaQuery.isError ? (
        <div className="py-10 text-center text-red-600">
          Failed to load booking edit data.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-black/[0.08] bg-[#F8FAFC]">
            {reservation.boat.image_url ? (
              <img
                src={reservation.boat.image_url}
                alt={reservation.boat.name || "Boat"}
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200" />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-gray-900 truncate">
                {reservation.boat.name || "Boat"}
              </h4>
              <div className="flex items-center gap-1 mt-1">
                <PinIcon />
                <span className="text-sm text-gray-500 truncate">
                  {reservation.location || "Location unavailable"}
                </span>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-900 text-sm">Date *</Label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, start_date: e.target.value, start_time: "" }))
                }
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 text-sm">Reservation Type *</Label>
              <Select
                value={form.booking_type}
                onValueChange={(value: "AM" | "PM" | "FULL_DAY") =>
                  setForm((prev) => ({ ...prev, booking_type: value, start_time: "" }))
                }
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select reservation type" />
                </SelectTrigger>
                <SelectContent>
                  {bookingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-900 text-sm">Start Time *</Label>
              <Select
                value={form.start_time}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, start_time: value }))
                }
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem
                      key={slot.time}
                      value={slot.time}
                      disabled={!slot.available}
                    >
                      {slot.label}
                      {!slot.available ? " (Reserved)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 text-sm">End Time</Label>
              <div className="h-10 rounded-md border border-gray-300 bg-gray-50 px-3 flex items-center text-sm text-gray-700">
                {dueTime}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900 text-sm">Destination</Label>
            <Select
              value={form.destination || "__none__"}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  destination: value === "__none__" ? "" : value,
                }))
              }
            >
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue placeholder="Where would you like to go" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Not specified</SelectItem>
                {destinationsQuery.data?.data?.map((dest) => (
                  <SelectItem key={dest.id} value={dest.id}>
                    {dest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900 text-sm">Notes</Label>
            <Textarea
              value={form.customer_notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, customer_notes: e.target.value }))
              }
              placeholder="Any special requests..."
              className="bg-white border-gray-300 min-h-[100px] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-900"
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#3B63FF] hover:bg-blue-700 text-white"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}

function ReservationCard({
  reservation,
  onView,
  onEdit,
  onCancel,
  cancelling,
}: {
  reservation: ReservationItem;
  onView: (id: number) => void;
  onEdit: (item: ReservationItem) => void;
  onCancel: (id: number) => void;
  cancelling: boolean;
}) {
  const isWaitlisted = reservation.card_type === "waitlisted";

  return (
    <div className="relative flex flex-col sm:flex-row items-stretch rounded-lg border border-black/[0.08] bg-white overflow-hidden">
      {isWaitlisted && reservation.waitlist_position ? (
        <div className="absolute top-3 left-3 z-10 flex items-center px-2.5 py-1 rounded bg-gray-800">
          <span className="text-[11px] font-semibold text-white uppercase tracking-wide">
            Waitlist Position: #{reservation.waitlist_position}
          </span>
        </div>
      ) : null}

      {reservation.boat.image_url ? (
        <img
          src={reservation.boat.image_url}
          alt={reservation.boat.name || "Boat"}
          className="w-full sm:w-[220px] md:w-[280px] h-40 sm:h-auto object-cover flex-shrink-0"
        />
      ) : (
        <div
          className={cn(
            "w-full sm:w-[220px] md:w-[280px] h-40 sm:h-auto bg-gradient-to-br flex-shrink-0",
            getDefaultImage(reservation)
          )}
        />
      )}

      <div className="flex flex-col justify-between p-6 flex-1 gap-4">
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold text-gray-900">
                {reservation.boat.name || "Boat"}
              </span>
              <div className="flex items-center gap-1">
                <PinIcon />
                <span className="text-sm text-gray-500">
                  {reservation.location || "Location unavailable"}
                </span>
              </div>
            </div>
            <StatusBadge reservation={reservation} />
          </div>

          <div className="flex flex-col xs:flex-row gap-4">
            <InfoField
              label={isWaitlisted ? "Requested Date" : "Date"}
              value={reservation.start_date_formatted || "—"}
            />
            <InfoField
              label={isWaitlisted ? "Time Slot" : "Time"}
              value={isWaitlisted ? reservation.booking_type_label || "—" : formatTripTime(reservation)}
            />
            <InfoField
              label="Duration"
              value={reservation.duration_label || "—"}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-black/[0.08] flex-wrap">
          {reservation.can_cancel ? (
            <button
              onClick={() => onCancel(reservation.id)}
              disabled={cancelling}
              className="px-4 py-2 text-[13px] font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {isWaitlisted ? "Leave Waitlist" : "Cancel Reservation"}
            </button>
          ) : null}

          {reservation.can_modify ? (
            <button
              onClick={() => onEdit(reservation)}
              className="px-4 py-2 text-sm font-medium text-gray-900 rounded-md border border-black/[0.08] bg-white hover:bg-gray-50 transition-colors"
            >
              {isWaitlisted ? "Edit Request" : "Modify Booking"}
            </button>
          ) : null}

          <button
            onClick={() => onView(reservation.id)}
            className="px-4 py-2 text-sm font-semibold text-white rounded-md bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryCard({
  reservation,
  onView,
}: {
  reservation: ReservationItem;
  onView: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 rounded-lg border border-black/[0.08] bg-[#F5F7FA] opacity-80">
      {reservation.boat.image_url ? (
        <img
          src={reservation.boat.image_url}
          alt={reservation.boat.name || "Boat"}
          className="w-12 h-12 rounded-md object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0" />
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-base font-semibold text-gray-900 truncate">
          {reservation.boat.name || "Boat"}
        </span>
        <span className="text-[13px] text-gray-500">
          {reservation.start_date_formatted || "—"} · {reservation.duration_label || "—"}
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {reservation.status === "completed" ? <CompletedBadge /> : <CancelledBadge />}
        <button
          onClick={() => onView(reservation.id)}
          className="px-3 py-1.5 text-xs font-medium text-gray-900 rounded-md border border-black/[0.08] bg-white hover:bg-gray-50 transition-colors"
        >
          {reservation.can_view_receipt ? "View Receipt" : "View Details"}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function MyTrips() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [viewReservationId, setViewReservationId] = useState<number | null>(null);
  const [editReservation, setEditReservation] = useState<ReservationItem | null>(null);

  const tripsQuery = useQuery({
    queryKey: ["my-trips"],
    queryFn: () => apiFetch<TripsResponse>("/api/my-trips"),
  });

  const cancelMutation = useMutation({
    mutationFn: (reservationId: number) =>
      apiFetch<{ success: boolean; message: string }>(
        `/api/my-trips/${reservationId}/cancel`,
        {
          method: "PATCH",
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-trips"] });
    },
  });

  const counts = tripsQuery.data?.data.counts;
  const tabs = tripsQuery.data?.data.tabs;

  const handleCancel = (reservationId: number) => {
    const ok = window.confirm("Are you sure you want to cancel this reservation?");
    if (!ok) return;
    cancelMutation.mutate(reservationId);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-black/[0.08]">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-[32px] font-bold text-gray-900 tracking-tight">
              My Reservations
            </h1>
            <p className="text-base text-gray-500">
              Manage your upcoming adventures and view past history.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex items-end gap-6">
              <TabButton
                label="Upcoming"
                count={counts?.upcoming}
                active={activeTab === "upcoming"}
                onClick={() => setActiveTab("upcoming")}
              />
              <TabButton
                label="History"
                count={counts?.history}
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
              />
              <TabButton
                label="Cancelled"
                count={counts?.cancelled}
                active={activeTab === "cancelled"}
                onClick={() => setActiveTab("cancelled")}
              />
            </div>

            <Link
              to="/browse"
              className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#3B63FF] hover:bg-blue-700 text-white text-sm font-semibold transition-colors self-start sm:self-auto"
            >
              <PlusIcon />
              Reserve a Boat
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          {tripsQuery.isLoading ? (
            <div className="text-center py-16 text-gray-500">Loading reservations...</div>
          ) : tripsQuery.isError ? (
            <div className="text-center py-16 text-red-600">
              Failed to load reservations.
            </div>
          ) : (
            <>
              {activeTab === "upcoming" && (
                <>
                  {tabs?.upcoming?.length ? (
                    <>
                      {tabs.upcoming.map((reservation) => (
                        <ReservationCard
                          key={reservation.id}
                          reservation={reservation}
                          onView={setViewReservationId}
                          onEdit={setEditReservation}
                          onCancel={handleCancel}
                          cancelling={
                            cancelMutation.isPending &&
                            cancelMutation.variables === reservation.id
                          }
                        />
                      ))}

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-bold text-gray-900">
                            Recent History
                          </h2>
                          <button
                            onClick={() => setActiveTab("history")}
                            className="flex items-center gap-1.5 text-sm font-semibold text-[#3B63FF] hover:text-blue-700 transition-colors"
                          >
                            View All History
                            <ArrowRightIcon />
                          </button>
                        </div>

                        {tabs?.history?.[0] ? (
                          <HistoryCard
                            reservation={tabs.history[0]}
                            onView={setViewReservationId}
                          />
                        ) : (
                          <EmptyState text="No recent history yet." />
                        )}
                      </div>
                    </>
                  ) : (
                    <EmptyState text="No upcoming reservations." />
                  )}
                </>
              )}

              {activeTab === "history" && (
                <>
                  {tabs?.history?.length ? (
                    <div className="flex flex-col gap-4">
                      {tabs.history.map((reservation) => (
                        <HistoryCard
                          key={reservation.id}
                          reservation={reservation}
                          onView={setViewReservationId}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No reservation history." />
                  )}
                </>
              )}

              {activeTab === "cancelled" && (
                <>
                  {tabs?.cancelled?.length ? (
                    <div className="flex flex-col gap-4">
                      {tabs.cancelled.map((reservation) => (
                        <HistoryCard
                          key={reservation.id}
                          reservation={reservation}
                          onView={setViewReservationId}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No cancelled reservations." />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <ViewReservationModal
        reservationId={viewReservationId}
        open={!!viewReservationId}
        onClose={() => setViewReservationId(null)}
      />

      <EditReservationModal
        reservation={editReservation}
        open={!!editReservation}
        onClose={() => setEditReservation(null)}
      />
    </div>
  );
}