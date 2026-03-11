import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────────────────────

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.6673 5.83341C11.6673 8.746 8.43623 11.7793 7.35123 12.7162C7.14359 12.8723 6.85771 12.8723 6.65007 12.7162C5.56507 11.7793 2.33398 8.746 2.33398 5.83341C2.33398 3.25781 4.42505 1.16675 7.00065 1.16675C9.57625 1.16675 11.6673 3.25781 11.6673 5.83341" stroke="#6B7280" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.25 5.8335C5.25 6.79935 6.03415 7.5835 7 7.5835C7.96585 7.5835 8.75 6.79935 8.75 5.8335C8.75 4.86764 7.96585 4.0835 7 4.0835C6.03415 4.0835 5.25 4.86764 5.25 5.8335V5.8335" stroke="#6B7280" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip_check)">
        <path d="M1 6C1 8.75958 3.24042 11 6 11C8.75958 11 11 8.75958 11 6C11 3.24042 8.75958 1 6 1C3.24042 1 1 3.24042 1 6V6" stroke="#1D4ED8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 6L5.5 7L7.5 5" stroke="#1D4ED8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip_check">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip_clock)">
        <path d="M6 3V6L8 7" stroke="#C24B28" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 6C1 8.75958 3.24042 11 6 11C8.75958 11 11 8.75958 11 6C11 3.24042 8.75958 1 6 1C3.24042 1 1 3.24042 1 6V6" stroke="#C24B28" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip_clock">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.33398 7.99992H12.6673M8.00065 3.33325V12.6666" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.91602 6.99984H11.0827M6.99935 2.9165L11.0827 6.99984L6.99935 11.0832" stroke="#3B63FF" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

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

interface InfoFieldProps {
  label: string;
  value: string;
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-[15px] font-medium text-gray-900">{value}</span>
    </div>
  );
}

// ── Reservation Card: Confirmed ─────────────────────────────────────────────

function ConfirmedReservationCard() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch rounded-lg border border-black/[0.08] bg-white overflow-hidden">
      {/* Image placeholder */}
      <div className="w-full sm:w-[220px] md:w-[280px] h-40 sm:h-auto bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0" />

      {/* Content */}
      <div className="flex flex-col justify-between p-6 flex-1 gap-4">
        {/* Header row */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold text-gray-900">Cobalt R5 Surf</span>
              <div className="flex items-center gap-1">
                <PinIcon />
                <span className="text-sm text-gray-500">West Palm Beach Marina</span>
              </div>
            </div>
            <ConfirmedBadge />
          </div>

          {/* Info fields */}
          <div className="flex flex-col xs:flex-row gap-4">
            <InfoField label="Date" value="Fri, Oct 24, 2025" />
            <InfoField label="Time" value="9:00 AM - 1:00 PM" />
            <InfoField label="Duration" value="4 Hours" />
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-black/[0.08]">
          <button className="px-4 py-2 text-[13px] font-medium text-red-500 hover:text-red-600 transition-colors">
            Cancel Reservation
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-900 rounded-md border border-black/[0.08] bg-white hover:bg-gray-50 transition-colors">
            Modify Booking
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white rounded-md bg-gray-900 hover:bg-gray-800 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reservation Card: Waitlisted ────────────────────────────────────────────

function WaitlistedReservationCard() {
  return (
    <div className="relative flex flex-col sm:flex-row items-stretch rounded-lg border border-black/[0.08] bg-white overflow-hidden">
      {/* Waitlist badge (absolute top-left) */}
      <div className="absolute top-3 left-3 z-10 flex items-center px-2.5 py-1 rounded bg-gray-800">
        <span className="text-[11px] font-semibold text-white uppercase tracking-wide">
          Waitlist Position: #1
        </span>
      </div>

      {/* Image placeholder */}
      <div className="w-full sm:w-[220px] md:w-[280px] h-40 sm:h-auto bg-gradient-to-br from-orange-100 to-orange-200 flex-shrink-0" />

      {/* Content */}
      <div className="flex flex-col justify-between p-6 flex-1 gap-4">
        {/* Header row */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold text-gray-900">Sea Hunt Gamefish 27</span>
              <div className="flex items-center gap-1">
                <PinIcon />
                <span className="text-sm text-gray-500">Jupiter Inlet Marina</span>
              </div>
            </div>
            <WaitlistedBadge />
          </div>

          {/* Info fields */}
          <div className="flex flex-col xs:flex-row gap-4">
            <InfoField label="Requested Date" value="Sat, Nov 02, 2025" />
            <InfoField label="Time Slot" value="Full Day" />
            <InfoField label="Duration" value="8 Hours" />
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-black/[0.08]">
          <button className="px-4 py-2 text-[13px] font-medium text-red-500 hover:text-red-600 transition-colors">
            Leave Waitlist
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-900 rounded-md border border-black/[0.08] bg-white hover:bg-gray-50 transition-colors">
            Edit Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ── History Card (compact) ──────────────────────────────────────────────────

function HistoryCard() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 rounded-lg border border-black/[0.08] bg-[#F5F7FA] opacity-80">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-md bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0" />

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-base font-semibold text-gray-900">Hurricane Deck Boat</span>
        <span className="text-[13px] text-gray-500">Oct 10, 2025 · 4 Hours</span>
      </div>

      {/* Status + action */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <CompletedBadge />
        <button className="px-3 py-1.5 text-xs font-medium text-gray-900 rounded-md border border-black/[0.08] bg-white hover:bg-gray-50 transition-colors">
          View Receipt
        </button>
      </div>
    </div>
  );
}

// ── Tabs ────────────────────────────────────────────────────────────────────

type Tab = "upcoming" | "history" | "cancelled";

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

// ── Main Page ───────────────────────────────────────────────────────────────

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-24 py-12">

        {/* Page header */}
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
            {/* Tabs */}
            <div className="flex items-end gap-6">
              <TabButton
                label="Upcoming"
                count={2}
                active={activeTab === "upcoming"}
                onClick={() => setActiveTab("upcoming")}
              />
              <TabButton
                label="History"
                count={48}
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
              />
              <TabButton
                label="Cancelled"
                active={activeTab === "cancelled"}
                onClick={() => setActiveTab("cancelled")}
              />
            </div>

            {/* Book a Boat button */}
            <Link
              to="/browse"
              className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#3B63FF] hover:bg-blue-700 text-white text-sm font-semibold transition-colors self-start sm:self-auto"
            >
              <PlusIcon />
              Book a Boat
            </Link>
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-8 flex flex-col gap-6">
          {activeTab === "upcoming" && (
            <>
              <ConfirmedReservationCard />
              <WaitlistedReservationCard />

              {/* Recent History section */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Recent History</h2>
                  <button className="flex items-center gap-1.5 text-sm font-semibold text-[#3B63FF] hover:text-blue-700 transition-colors">
                    View All History
                    <ArrowRightIcon />
                  </button>
                </div>
                <HistoryCard />
              </div>
            </>
          )}

          {activeTab === "history" && (
            <div className="flex flex-col gap-4">
              <HistoryCard />
              <HistoryCard />
              <HistoryCard />
            </div>
          )}

          {activeTab === "cancelled" && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-base">No cancelled reservations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
