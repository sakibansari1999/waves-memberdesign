export default function ReservationCard() {
  return (
    <div className="flex-1 min-w-0 bg-white rounded-xl border border-black/[0.08] shadow-sm overflow-hidden flex flex-col justify-between p-8 relative min-h-[360px]">
      {/* Boat image overlay on the right */}
      <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none select-none hidden lg:block">
        <img
          src="https://images.pexels.com/photos/4910997/pexels-photo-4910997.jpeg"
          alt="Cobalt R5 Surf"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Confirmed badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full w-fit">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.66699 1.16675V3.50008M9.33366 1.16675V3.50008" stroke="#1D4ED8" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.91667 2.3335H11.0833C11.7272 2.3335 12.25 2.85626 12.25 3.50016V11.6668C12.25 12.3107 11.7272 12.8335 11.0833 12.8335H2.91667C2.27277 12.8335 1.75 12.3107 1.75 11.6668V3.50016C1.75 2.85626 2.27277 2.3335 2.91667 2.3335V2.3335" stroke="#1D4ED8" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.75 5.8335H12.25M5.25 9.3335L6.41667 10.5002L8.75 8.16683" stroke="#1D4ED8" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-blue-700 text-xs font-semibold">Confirmed</span>
        </div>

        {/* Boat name & location */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[36px] font-extrabold text-gray-900 leading-tight tracking-tight">
            Cobalt R5 Surf
          </h2>
          <p className="text-sm font-medium text-gray-600">West Palm Beach Marina</p>
        </div>

        {/* Trip details */}
        <div className="flex items-start gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Date</span>
            <span className="text-base font-semibold text-gray-900">Fri, Oct 24</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Departure</span>
            <span className="text-base font-semibold text-gray-900">09:00 AM</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.5px]">Duration</span>
            <span className="text-base font-semibold text-gray-900">4 Hours</span>
          </div>
        </div>

        {/* Weather */}
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.33301 8.00016C5.33301 9.47194 6.5279 10.6668 7.99967 10.6668C9.47145 10.6668 10.6663 9.47194 10.6663 8.00016C10.6663 6.52839 9.47145 5.3335 7.99967 5.3335C6.5279 5.3335 5.33301 6.52839 5.33301 8.00016V8.00016" stroke="#F59E0B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.99967 1.3335V2.66683M7.99967 13.3335V14.6668M3.28634 3.28683L4.22634 4.22683M11.773 11.7735L12.713 12.7135M1.33301 8.00016H2.66634M13.333 8.00016H14.6663M4.22634 11.7735L3.28634 12.7135M12.713 3.28683L11.773 4.22683" stroke="#F59E0B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm text-gray-500">82°F · Sunny · Wind 5mph</span>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 flex items-center gap-4 mt-8">
        <button className="flex items-center gap-2 px-7 py-3.5 bg-[#3B63FF] hover:bg-blue-700 text-white font-semibold text-[15px] rounded-md transition-colors">
          View Reservation
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.33301 8.00016H12.6663M7.99967 3.3335L12.6663 8.00016L7.99967 12.6668" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="px-5 py-3.5 text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors">
          Modify Booking
        </button>
      </div>
    </div>
  );
}
