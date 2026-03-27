import { useMemo, useState } from "react";
import { Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
 const API_BASE_URL =import.meta.env.VITE_API_BASE_URL

interface BillingResponse {
  success: boolean;
  message: string;
  data: {
    overview: {
      current_balance: number;
      current_balance_formatted: string;
      is_all_paid: boolean;
      next_charge: {
        amount: number;
        amount_formatted: string;
        date: string | null;
        date_formatted: string | null;
        description: string;
      } | null;
      last_fuel_charge: {
        amount: number;
        amount_formatted: string;
        date: string | null;
        date_formatted: string | null;
      } | null;
      payment_method: {
        brand: string;
        last4: string;
        expiry: string;
        label: string;
      };
    };
    filters: {
      period: string;
      type: string;
      period_options: Array<{ value: string; label: string }>;
      type_options: Array<{ value: string; label: string }>;
    };
    invoices: Array<{
      id: number;
      invoice_number: string | null;
      description: string;
      type: string;
      date: string | null;
      date_formatted: string | null;
      amount: number;
      amount_formatted: string;
      status: string;
      status_label: string;
      can_view: boolean;
    }>;
    support: {
      email: string;
      phone: string;
    };
  };
}

interface InvoiceDetailResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    invoice_number: string | null;
    description: string;
    status: string;
    status_label: string;
    issue_date: string | null;
    issue_date_formatted: string | null;
    due_date: string | null;
    due_date_formatted: string | null;
    paid_date: string | null;
    paid_date_formatted: string | null;
    payment_method: string | null;
    subtotal: number;
    subtotal_formatted: string;
    tax_amount: number;
    tax_amount_formatted: string;
    discount: number;
    discount_formatted: string;
    total: number;
    total_formatted: string;
    notes: string | null;
    reservation: {
      id: number;
      booking_code: string | null;
      boat_name: string | null;
      start_date_formatted: string | null;
    } | null;
    items: Array<{
      id: number;
      description: string;
      quantity: number;
      rate: number;
      rate_formatted: string;
      amount: number;
      amount_formatted: string;
      type: string;
    }>;
  };
}

async function apiFetch<T>(url: string, options: RequestInit = {}) {
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

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Something went wrong.");
  }

  return response.json() as Promise<T>;
}

async function downloadFile(url: string) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(url, {
    headers: {
      Accept: "text/csv,application/octet-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to download statement.");
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);

  const disposition = response.headers.get("Content-Disposition");
  const filenameMatch = disposition?.match(/filename="?([^"]+)"?/);
  const filename = filenameMatch?.[1] || "billing-statement.csv";

  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(objectUrl);
}

function VisaLogo() {
  return (
    <svg width="62" height="20" viewBox="0 0 62 20" fill="none">
      <g clipPath="url(#clip0_visa)">
        <path
          d="M31.9595 6.36819C31.9244 9.14313 34.4325 10.6916 36.3219 11.6123C38.2631 12.5569 38.9152 13.1627 38.9075 14.0075C38.893 15.3002 37.3591 15.8708 35.9236 15.893C33.4193 15.9318 31.9631 15.2169 30.8056 14.6761L29.9034 18.8976C31.0648 19.4328 33.2154 19.8995 35.4456 19.92C40.6805 19.92 44.1053 17.3359 44.1239 13.3294C44.1444 8.24458 37.0906 7.96313 37.1388 5.69036C37.1554 5.0012 37.813 4.26578 39.254 4.0788C39.9672 3.98434 41.9362 3.91205 44.1684 4.94L45.0446 0.855663C43.8441 0.418554 42.3012 0 40.3803 0C35.453 0 31.9875 2.61928 31.9595 6.36819ZM53.4634 0.351807C52.5075 0.351807 51.7019 0.909398 51.3424 1.76506L43.8646 19.62H49.0957L50.1366 16.7431H56.5289L57.1328 19.62H61.7434L57.72 0.351807H53.4634ZM54.1952 5.55687L55.7048 12.7923H51.5704L54.1952 5.55687ZM25.6171 0.352048L21.4937 19.6198H26.4786L30.6 0.351566L25.6171 0.352048ZM18.2429 0.352048L13.0545 13.4665L10.9557 2.31542C10.7094 1.0706 9.73688 0.351807 8.65688 0.351807H0.175436L0.0566406 0.911325C1.79785 1.28916 3.77616 1.89855 4.97471 2.5506C5.70821 2.94892 5.91736 3.29711 6.15833 4.24361L10.1335 19.62H15.4012L23.4774 0.351807L18.2429 0.352048Z"
          fill="url(#paint0_linear_visa)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_visa"
          x1="28.4165"
          y1="-0.399595"
          x2="33.8676"
          y2="19.931"
          gradientUnits="userSpaceOnUse"
        >
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
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M12 10.5V12.15L13.2 12.9M12 1.5V4.5M15.75 5.625V4.5C15.75 3.67213 15.0779 3 14.25 3H3.75C2.92213 3 2.25 3.67213 2.25 4.5V15C2.25 15.8279 2.92213 16.5 3.75 16.5H6.375M2.25 7.5H6M6 1.5V4.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12C7.5 14.4836 9.51638 16.5 12 16.5C14.4836 16.5 16.5 14.4836 16.5 12C16.5 9.51638 14.4836 7.5 12 7.5C9.51638 7.5 7.5 9.51638 7.5 12V12" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FuelStationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M10.5 9.75H12C12.8279 9.75 13.5 10.4221 13.5 11.25V12.75C13.5 13.5779 14.1721 14.25 15 14.25C15.8279 14.25 16.5 13.5779 16.5 12.75V7.5015C16.5003 7.10172 16.341 6.71835 16.0575 6.4365L13.5 3.75M10.5 15.75V3.75C10.5 2.92213 9.82787 2.25 9 2.25H3.75C2.92213 2.25 2.25 2.92213 2.25 3.75V15.75M1.5 15.75H11.25M2.25 6.75H10.5" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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

function InvoiceModal({
  invoiceId,
  onClose,
}: {
  invoiceId: number | null;
  onClose: () => void;
}) {
  const invoiceQuery = useQuery({
    queryKey: ["billing-invoice", invoiceId],
    enabled: !!invoiceId,
    queryFn: () => apiFetch<InvoiceDetailResponse>(`/api/billing/invoices/${invoiceId}`),
  });

  if (!invoiceId) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 p-4 sm:p-6 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-black/[0.08] overflow-hidden">
            <div className="px-6 py-5 border-b border-black/[0.08] flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#111827]">Invoice Details</h3>
                <p className="text-sm text-[#6B7280] mt-1">
                  Review billing breakdown and payment status.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-6">
              {invoiceQuery.isLoading ? (
                <div className="py-10 text-center text-[#6B7280]">Loading invoice...</div>
              ) : invoiceQuery.isError || !invoiceQuery.data?.data ? (
                <div className="py-10 text-center text-red-600">
                  Failed to load invoice.
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="rounded-xl border border-black/[0.08] p-5 bg-[#F8FAFC]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold text-[#111827]">
                          {invoiceQuery.data.data.description}
                        </div>
                        <div className="text-sm text-[#6B7280] mt-1">
                          #{invoiceQuery.data.data.invoice_number || invoiceQuery.data.data.id}
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E6F6EB] text-xs font-semibold text-[#008A3A]">
                        {invoiceQuery.data.data.status_label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoBox label="Issue Date" value={invoiceQuery.data.data.issue_date_formatted || "—"} />
                    <InfoBox label="Due Date" value={invoiceQuery.data.data.due_date_formatted || "—"} />
                    <InfoBox label="Paid Date" value={invoiceQuery.data.data.paid_date_formatted || "—"} />
                    <InfoBox label="Payment Method" value={invoiceQuery.data.data.payment_method || "—"} />
                  </div>

                  {invoiceQuery.data.data.reservation ? (
                    <div className="rounded-lg border border-black/[0.08] p-4">
                      <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-[0.5px] mb-2">
                        Linked Reservation
                      </div>
                      <div className="text-sm text-[#111827] font-medium">
                        {invoiceQuery.data.data.reservation.boat_name || "Boat"} ·{" "}
                        {invoiceQuery.data.data.reservation.start_date_formatted || "—"}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1">
                        Booking: {invoiceQuery.data.data.reservation.booking_code || "—"}
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-lg border border-black/[0.08] overflow-hidden">
                    <div className="px-4 py-3 border-b border-black/[0.08] text-sm font-semibold text-[#111827]">
                      Line Items
                    </div>
                    <div className="divide-y divide-black/[0.08]">
                      {invoiceQuery.data.data.items.map((item) => (
                        <div
                          key={item.id}
                          className="px-4 py-3 flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-[#111827]">
                              {item.description}
                            </div>
                            <div className="text-xs text-[#6B7280]">
                              Qty {item.quantity} × {item.rate_formatted}
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-[#111827]">
                            {item.amount_formatted}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-black/[0.08] p-4 bg-[#F9FAFB]">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-[#6B7280]">Subtotal</span>
                      <span className="text-sm font-medium text-[#111827]">
                        {invoiceQuery.data.data.subtotal_formatted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-[#6B7280]">Tax</span>
                      <span className="text-sm font-medium text-[#111827]">
                        {invoiceQuery.data.data.tax_amount_formatted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-[#6B7280]">Discount</span>
                      <span className="text-sm font-medium text-[#111827]">
                        {invoiceQuery.data.data.discount_formatted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/[0.08]">
                      <span className="text-base font-semibold text-[#111827]">Total</span>
                      <span className="text-base font-bold text-[#111827]">
                        {invoiceQuery.data.data.total_formatted}
                      </span>
                    </div>
                  </div>

                  {invoiceQuery.data.data.notes ? (
                    <div className="rounded-lg border border-black/[0.08] p-4">
                      <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-[0.5px] mb-2">
                        Notes
                      </div>
                      <div className="text-sm text-[#111827]">{invoiceQuery.data.data.notes}</div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/[0.08] p-4">
      <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-[0.5px] mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-[#111827]">{value}</div>
    </div>
  );
}

export default function Billing() {
  const [period, setPeriod] = useState("12m");
  const [type, setType] = useState("all");
  const [viewInvoiceId, setViewInvoiceId] = useState<number | null>(null);

  const queryString = useMemo(
    () => `period=${encodeURIComponent(period)}&type=${encodeURIComponent(type)}`,
    [period, type]
  );

  const billingQuery = useQuery({
    queryKey: ["billing", period, type],
    queryFn: () => apiFetch<BillingResponse>(`/api/billing?${queryString}`),
  });

  const downloadMutation = useMutation({
    mutationFn: () => downloadFile(`/api/billing/statement/download?${queryString}`),
  });

  const data = billingQuery.data?.data;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-bold text-[#111827] tracking-[-0.5px]">
              Invoices & Billing
            </h1>
            <p className="text-[15px] text-[#6B7280]">
              Manage your payments, view history, and update payment methods.
            </p>
          </div>

          <button
            onClick={() => downloadMutation.mutate()}
            disabled={downloadMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-[6px] border border-black/[0.08] bg-white text-sm font-medium text-[#111827] hover:bg-gray-50 transition-colors whitespace-nowrap disabled:opacity-60"
          >
            <Download size={16} />
            {downloadMutation.isPending ? "Downloading..." : "Download Statement"}
          </button>
        </div>

        {billingQuery.isLoading ? (
          <div className="text-center py-16 text-[#6B7280]">Loading billing...</div>
        ) : billingQuery.isError || !data ? (
          <div className="text-center py-16 text-red-600">
            Failed to load billing page.
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-6 mb-10">
              <div className="flex-1 bg-white rounded-xl border border-black/[0.08] p-8 flex flex-col justify-between min-h-[220px]">
                <div className="flex flex-col gap-1">
                  <p className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">
                    Current Balance
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[48px] font-bold text-[#111827] tracking-[-1px] leading-none">
                      {data.overview.current_balance_formatted}
                    </span>

                    {data.overview.is_all_paid ? (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#E6F6EB] text-[#008A3A] text-base font-medium">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M10 3L4.5 8.5L2 6" stroke="#008A3A" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        All Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FFF7ED] text-[#C2410C] text-sm font-medium">
                        Payment Due
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#6B7280] mt-2">
                    Next automated charge on{" "}
                    <span className="font-medium text-[#111827]">
                      {data.overview.next_charge?.date_formatted || "N/A"}
                    </span>
                  </p>
                </div>

                <div className="border-t border-black/[0.08] pt-6 mt-6 flex items-center gap-4">
                  <div className="flex items-center justify-center border border-black/[0.08] rounded px-2 py-1 bg-white">
                    <VisaLogo />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-[#111827]">
                      {data.overview.payment_method.brand} ending in {data.overview.payment_method.last4}
                    </span>
                    <span className="text-[13px] text-[#6B7280]">
                      {data.overview.payment_method.label} · Expires {data.overview.payment_method.expiry}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    className="text-sm font-semibold text-[#3B63FF] hover:text-blue-700 transition-colors"
                  >
                    Update
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:w-[320px]">
                <div className="bg-white rounded-xl border border-black/[0.08] p-6 flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#EFF6FF] flex-shrink-0">
                    <CalendarClockIcon />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">
                      Next Bill
                    </p>
                    <p className="text-2xl font-bold text-[#111827]">
                      {data.overview.next_charge?.amount_formatted || "$0.00"}
                    </p>
                    <p className="text-[13px] text-[#6B7280]">
                      {data.overview.next_charge?.description || "No upcoming bill"}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-black/[0.08] p-6 flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FDF2F8] flex-shrink-0">
                    <FuelStationIcon />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">
                      Last Fuel Charge
                    </p>
                    <p className="text-2xl font-bold text-[#111827]">
                      {data.overview.last_fuel_charge?.amount_formatted || "$0.00"}
                    </p>
                    <p className="text-[13px] text-[#6B7280]">
                      {data.overview.last_fuel_charge?.date_formatted || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-[18px] font-bold text-[#111827]">Invoice History</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 rounded-[6px] border border-black/[0.08] bg-white text-sm font-medium text-[#111827] hover:bg-gray-50 transition-colors"
                  >
                    {data.filters.period_options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="px-4 py-2 rounded-[6px] border border-black/[0.08] bg-white text-sm font-medium text-[#111827] hover:bg-gray-50 transition-colors"
                  >
                    {data.filters.type_options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-black/[0.08] overflow-hidden">
                <div className="bg-[#FF7A00] px-6 py-4 grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 items-center">
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.5px]">Description</span>
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.5px]">Date</span>
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.5px]">Amount</span>
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.5px]">Status</span>
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.5px] text-right">Actions</span>
                </div>

                {data.invoices.length === 0 ? (
                  <div className="px-6 py-10 text-center text-[#6B7280]">
                    No invoices found for the selected filters.
                  </div>
                ) : (
                  data.invoices.map((invoice, index) => (
                    <div
                      key={invoice.id}
                      className={`px-6 py-5 grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 items-center ${
                        index < data.invoices.length - 1 ? "border-b border-black/[0.08]" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-sm font-medium text-[#111827] truncate">
                          {invoice.description}
                        </span>
                        <span className="text-[13px] text-[#6B7280] font-mono">
                          #{invoice.invoice_number || invoice.id}
                        </span>
                      </div>

                      <span className="text-[13px] text-[#6B7280]">
                        {invoice.date_formatted || "—"}
                      </span>

                      <span className="text-sm font-semibold text-[#111827]">
                        {invoice.amount_formatted}
                      </span>

                      <div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E6F6EB] text-xs font-semibold text-[#008A3A]">
                          {invoice.status_label}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setViewInvoiceId(invoice.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <Eye size={16} className="text-[#6B7280]" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 p-6 rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full border border-black/[0.08] bg-white flex-shrink-0">
                <QuestionIcon />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-[#111827]">Questions about your bill?</p>
                <p className="text-[13px] text-[#6B7280]">
                  Contact our support team at{" "}
                  <a
                    href={`mailto:${data.support.email}`}
                    className="font-medium text-[#3B63FF] hover:underline"
                  >
                    {data.support.email}
                  </a>{" "}
                  or call {data.support.phone}.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <InvoiceModal
        invoiceId={viewInvoiceId}
        onClose={() => setViewInvoiceId(null)}
      />
    </div>
  );
}