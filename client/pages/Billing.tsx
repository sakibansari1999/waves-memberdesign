import { Download, Eye } from "lucide-react";

const invoices = [
  {
    id: "INV-2025-004",
    description: "Fuel Charge: Fig Tales",
    date: "Oct 12, 2025",
    amount: "$142.50",
    status: "Paid",
  },
  {
    id: "INV-2025-003",
    description: "Monthly Membership",
    date: "Oct 01, 2025",
    amount: "$450.00",
    status: "Paid",
  },
  {
    id: "INV-2025-002",
    description: "Fuel Charge: Sea Pro",
    date: "Sep 28, 2025",
    amount: "$89.20",
    status: "Paid",
  },
  {
    id: "INV-2025-001",
    description: "Monthly Membership",
    date: "Sep 01, 2025",
    amount: "$450.00",
    status: "Paid",
  },
];

function VisaLogo() {
  return (
    <svg width="62" height="20" viewBox="0 0 62 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_visa)">
        <path
          d="M31.9595 6.36819C31.9244 9.14313 34.4325 10.6916 36.3219 11.6123C38.2631 12.5569 38.9152 13.1627 38.9075 14.0075C38.893 15.3002 37.3591 15.8708 35.9236 15.893C33.4193 15.9318 31.9631 15.2169 30.8056 14.6761L29.9034 18.8976C31.0648 19.4328 33.2154 19.8995 35.4456 19.92C40.6805 19.92 44.1053 17.3359 44.1239 13.3294C44.1444 8.24458 37.0906 7.96313 37.1388 5.69036C37.1554 5.0012 37.813 4.26578 39.254 4.0788C39.9672 3.98434 41.9362 3.91205 44.1684 4.94L45.0446 0.855663C43.8441 0.418554 42.3012 0 40.3803 0C35.453 0 31.9875 2.61928 31.9595 6.36819ZM53.4634 0.351807C52.5075 0.351807 51.7019 0.909398 51.3424 1.76506L43.8646 19.62H49.0957L50.1366 16.7431H56.5289L57.1328 19.62H61.7434L57.72 0.351807H53.4634ZM54.1952 5.55687L55.7048 12.7923H51.5704L54.1952 5.55687ZM25.6171 0.352048L21.4937 19.6198H26.4786L30.6 0.351566L25.6171 0.352048ZM18.2429 0.352048L13.0545 13.4665L10.9557 2.31542C10.7094 1.0706 9.73688 0.351807 8.65688 0.351807H0.175436L0.0566406 0.911325C1.79785 1.28916 3.77616 1.89855 4.97471 2.5506C5.70821 2.94892 5.91736 3.29711 6.15833 4.24361L10.1335 19.62H15.4012L23.4774 0.351807L18.2429 0.352048Z"
          fill="url(#paint0_linear_visa)"
        />
      </g>
      <defs>
        <linearGradient id="paint0_linear_visa" x1="28.4165" y1="-0.399595" x2="33.8676" y2="19.931" gradientUnits="userSpaceOnUse">
          <stop stopColor="#222357" />
          <stop offset="1" stopColor="#254AA5" />
        </linearGradient>
        <clipPath id="clip0_visa">
          <rect width="61.8" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function CalendarClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10.5V12.15L13.2 12.9M12 1.5V4.5M15.75 5.625V4.5C15.75 3.67213 15.0779 3 14.25 3H3.75C2.92213 3 2.25 3.67213 2.25 4.5V15C2.25 15.8279 2.92213 16.5 3.75 16.5H6.375M2.25 7.5H6M6 1.5V4.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12C7.5 14.4836 9.51638 16.5 12 16.5C14.4836 16.5 16.5 14.4836 16.5 12C16.5 9.51638 14.4836 7.5 12 7.5C9.51638 7.5 7.5 9.51638 7.5 12V12" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FuelStationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 9.75H12C12.8279 9.75 13.5 10.4221 13.5 11.25V12.75C13.5 13.5779 14.1721 14.25 15 14.25C15.8279 14.25 16.5 13.5779 16.5 12.75V7.5015C16.5003 7.10172 16.341 6.71835 16.0575 6.4365L13.5 3.75M10.5 15.75V3.75C10.5 2.92213 9.82787 2.25 9 2.25H3.75C2.92213 2.25 2.25 2.92213 2.25 3.75V15.75M1.5 15.75H11.25M2.25 6.75H10.5" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_question)">
        <path d="M1.66602 9.99984C1.66602 14.5991 5.40006 18.3332 9.99935 18.3332C14.5986 18.3332 18.3327 14.5991 18.3327 9.99984C18.3327 5.40055 14.5986 1.6665 9.99935 1.6665C5.40006 1.6665 1.66602 5.40055 1.66602 9.99984Z" stroke="#3B63FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.57422 7.49973C7.97875 6.34977 9.15371 5.65923 10.3552 5.86532C11.5567 6.07141 12.4344 7.11402 12.4326 8.33306C12.4326 9.99973 9.93255 10.8331 9.93255 10.8331M9.99922 14.1664H10.0076" stroke="#3B63FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_question">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function Billing() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-bold text-[#111827] tracking-[-0.5px]">
              Invoices & Billing
            </h1>
            <p className="text-[15px] text-[#6B7280]">
              Manage your payments, view history, and update payment methods.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-[6px] border border-black/[0.08] bg-white text-sm font-medium text-[#111827] hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Download size={16} />
            Download Statement
          </button>
        </div>

        {/* Billing Overview */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">

          {/* Balance Card */}
          <div className="flex-1 bg-white rounded-xl border border-black/[0.08] p-8 flex flex-col justify-between min-h-[220px]">
            <div className="flex flex-col gap-1">
              <p className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">
                Current Balance
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[48px] font-bold text-[#111827] tracking-[-1px] leading-none">
                  $0.00
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#E6F6EB] text-[#008A3A] text-base font-medium">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 3L4.5 8.5L2 6" stroke="#008A3A" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  All Paid
                </span>
              </div>
              <p className="text-sm text-[#6B7280] mt-2">
                Next automated charge on{" "}
                <span className="font-medium text-[#111827]">Nov 1, 2025</span>
              </p>
            </div>

            {/* Payment Method */}
            <div className="border-t border-black/[0.08] pt-6 mt-6 flex items-center gap-4">
              <div className="flex items-center justify-center border border-black/[0.08] rounded px-2 py-1 bg-white">
                <VisaLogo />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-semibold text-[#111827]">Visa ending in 4242</span>
                <span className="text-[13px] text-[#6B7280]">Primary method · Expires 08/28</span>
              </div>
              <button className="text-sm font-semibold text-[#3B63FF] hover:text-blue-700 transition-colors">
                Update
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-col gap-6 lg:w-[320px]">
            {/* Next Bill */}
            <div className="bg-white rounded-xl border border-black/[0.08] p-6 flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#EFF6FF] flex-shrink-0">
                <CalendarClockIcon />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">
                  Next Bill
                </p>
                <p className="text-2xl font-bold text-[#111827]">$450.00</p>
                <p className="text-[13px] text-[#6B7280]">Monthly Membership</p>
              </div>
            </div>

            {/* Last Fuel Charge */}
            <div className="bg-white rounded-xl border border-black/[0.08] p-6 flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FDF2F8] flex-shrink-0">
                <FuelStationIcon />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">
                  Last Fuel Charge
                </p>
                <p className="text-2xl font-bold text-[#111827]">$142.50</p>
                <p className="text-[13px] text-[#6B7280]">Oct 12, 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-[18px] font-bold text-[#111827]">Invoice History</h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-[6px] border border-black/[0.08] bg-white text-sm font-medium text-[#111827] hover:bg-gray-50 transition-colors">
                Last 12 Months
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" opacity="0.5">
                  <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#111827" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-[6px] border border-black/[0.08] bg-white text-sm font-medium text-[#111827] hover:bg-gray-50 transition-colors">
                All Types
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" opacity="0.5">
                  <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#111827" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-black/[0.08] overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#FF7A00] px-6 py-4 grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 items-center">
              <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.5px]">Description</span>
              <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.5px]">Date</span>
              <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.5px]">Amount</span>
              <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.5px]">Status</span>
              <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.5px] text-right">Actions</span>
            </div>

            {/* Table Rows */}
            {invoices.map((invoice, index) => (
              <div
                key={invoice.id}
                className={`px-6 py-5 grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 items-center ${
                  index < invoices.length - 1 ? "border-b border-black/[0.08]" : ""
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-medium text-[#111827] truncate">
                    {invoice.description}
                  </span>
                  <span className="text-[13px] text-[#6B7280] font-mono">
                    #{invoice.id}
                  </span>
                </div>
                <span className="text-[13px] text-[#6B7280]">{invoice.date}</span>
                <span className="text-sm font-semibold text-[#111827]">{invoice.amount}</span>
                <div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E6F6EB] text-xs font-semibold text-[#008A3A]">
                    {invoice.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                    <Eye size={16} className="text-[#6B7280]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Box */}
        <div className="mt-6 p-6 rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex items-start gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-black/[0.08] bg-white flex-shrink-0">
            <QuestionIcon />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[#111827]">Questions about your bill?</p>
            <p className="text-[13px] text-[#6B7280]">
              Contact our support team at{" "}
              <a href="mailto:billing@waves-marina.com" className="font-medium text-[#3B63FF] hover:underline">
                billing@waves-marina.com
              </a>{" "}
              or call (555) 123-4567.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
