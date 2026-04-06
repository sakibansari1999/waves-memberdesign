import { Link } from "react-router-dom";

interface ReservationCardProps {
  reservation: {
    id: number;
    booking_code?: string | null;
    status: string;
    boat_name: string | null;
    location: string | null;
    destination?: string | null;
    date?: string | null;
    date_formatted?: string | null;
    departure_time?: string | null;
    due_time?: string | null;
    duration_hours?: number;
    booking_type?: string | null;
    booking_type_label?: string | null;
    image_url?: string | null;
  } | null;
}

export default function ReservationCard({ reservation }: ReservationCardProps) {
  if (!reservation) {
    return (
      <div className="flex-1 min-w-0 bg-white rounded-xl border border-black/[0.08] shadow-sm overflow-hidden flex flex-col justify-between p-8 relative min-h-[360px]">
        <div className="flex flex-col justify-center h-full gap-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full w-fit">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 3.5V7L9.33333 9.33333"
                stroke="#6B7280"
                strokeWidth="1.16667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.25 7C12.25 9.89949 9.89949 12.25 7 12.25C4.1005 12.25 1.75 9.89949 1.75 7C1.75 4.1005 4.1005 1.75 7 1.75C9.89949 1.75 12.25 4.1005 12.25 7Z"
                stroke="#6B7280"
                strokeWidth="1.16667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-gray-600 text-xs font-semibold">No upcoming trip</span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[36px] font-extrabold text-gray-900 leading-tight tracking-tight">
              Plan your next outing
            </h2>
            <p className="text-sm font-medium text-gray-600">
              You don&apos;t have any upcoming reservations right now.
            </p>
          </div>

     <div className="flex items-center gap-4 mt-4">
  <Link
    to="/browse"
    className="flex items-center gap-2 px-7 py-3.5 bg-[#3B63FF] hover:bg-blue-700 text-white font-semibold text-[15px] rounded-md transition-colors"
  >
    Reserve a Boat
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3.33301 8.00016H12.6663M7.99967 3.3335L12.6663 8.00016L7.99967 12.6668"
        stroke="white"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Link>
</div>
        </div>
      </div>
    );
  }

  const statusText = reservation.status || "Pending";
  const normalizedStatus = statusText.toLowerCase();

  const badgeClasses =
    normalizedStatus === "confirmed"
      ? "bg-blue-50 text-blue-700"
      : normalizedStatus === "pending"
      ? "bg-amber-50 text-amber-700"
      : normalizedStatus === "cancelled"
      ? "bg-red-50 text-red-700"
      : normalizedStatus === "completed"
      ? "bg-green-50 text-green-700"
      : "bg-gray-100 text-gray-700";

  const boatName = reservation.boat_name || "Boat not assigned";
  const location = reservation.location || reservation.destination || "Location unavailable";
  const dateLabel = reservation.date_formatted || "TBD";
  const departureTime = reservation.departure_time || "TBD";
  const durationLabel =
    typeof reservation.duration_hours === "number" && reservation.duration_hours > 0
      ? `${reservation.duration_hours} ${reservation.duration_hours === 1 ? "Hour" : "Hours"}`
      : reservation.booking_type_label || "TBD";

  return (
    <div className="flex-1 min-w-0 bg-white rounded-xl border border-black/[0.08] shadow-sm overflow-hidden flex flex-col justify-between p-8 relative min-h-[360px]">
      {reservation.image_url ? (
        <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none select-none hidden lg:block">
          <img
            src={reservation.image_url}
            alt={boatName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
        </div>
      ) : null}

      <div className="relative z-10 flex flex-col gap-6">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit ${badgeClasses}`}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.66699 1.16675V3.50008M9.33366 1.16675V3.50008"
              stroke="currentColor"
              strokeWidth="1.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.91667 2.3335H11.0833C11.7272 2.3335 12.25 2.85626 12.25 3.50016V11.6668C12.25 12.3107 11.7272 12.8335 11.0833 12.8335H2.91667C2.27277 12.8335 1.75 12.3107 1.75 11.6668V3.50016C1.75 2.85626 2.27277 2.3335 2.91667 2.3335V2.3335"
              stroke="currentColor"
              strokeWidth="1.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.75 5.8335H12.25M5.25 9.3335L6.41667 10.5002L8.75 8.16683"
              stroke="currentColor"
              strokeWidth="1.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs font-semibold">{statusText}</span>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[36px] font-extrabold text-gray-900 leading-tight tracking-tight">
            {boatName}
          </h2>
          <p className="text-sm font-medium text-gray-600">{location}</p>
        </div>

        <div className="flex items-start gap-8 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">
              Date
            </span>
            <span className="text-base font-semibold text-gray-900">{dateLabel}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">
              Departure
            </span>
            <span className="text-base font-semibold text-gray-900">{departureTime}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">
              Duration
            </span>
            <span className="text-base font-semibold text-gray-900">{durationLabel}</span>
          </div>
        </div>

        {reservation.destination ? (
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 14.0002C10.9455 14.0002 13.3333 11.6124 13.3333 8.66683C13.3333 5.72131 10.9455 3.3335 8 3.3335C5.05448 3.3335 2.66667 5.72131 2.66667 8.66683C2.66667 11.6124 5.05448 14.0002 8 14.0002Z"
                stroke="#6B7280"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 8.66683V8.6735"
                stroke="#6B7280"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 6.00016V6.00683"
                stroke="#6B7280"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-gray-500">Destination: {reservation.destination}</span>
          </div>
        ) : null}
      </div>

      <div className="relative z-10 flex items-center gap-4 mt-8 flex-wrap">
        <button className="flex items-center gap-2 px-7 py-3.5 bg-[#3B63FF] hover:bg-blue-700 text-white font-semibold text-[15px] rounded-md transition-colors">
          View Reservation
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.33301 8.00016H12.6663M7.99967 3.3335L12.6663 8.00016L7.99967 12.6668"
              stroke="white"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button className="px-5 py-3.5 text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors">
          Modify Booking
        </button>
      </div>
    </div>
  );
}