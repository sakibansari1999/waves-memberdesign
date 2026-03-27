import { Link } from "react-router-dom";

interface FinancialOverviewProps {
  financial: {
    outstanding_balance: number;
    next_membership_charge_date?: string | null;
    next_membership_charge_date_formatted?: string | null;
    recent_fuel?: {
      date?: string | null;
      date_formatted?: string | null;
      amount: number;
    } | null;
  };
}

export default function FinancialOverview({ financial }: FinancialOverviewProps) {
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col gap-6 flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Financial Overview</h3>
      <Link
  to="/billing"
  className="flex items-center gap-1 text-[13px] font-semibold text-[#3B63FF] hover:underline"
>
  View Invoices
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M2.5 6H9.5M6 2.5L9.5 6L6 9.5"
      stroke="#3B63FF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg border border-black/[0.08] px-6 py-0 divide-y divide-black/[0.08]">
        
        {/* Outstanding Balance */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Outstanding Balance</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(financial.outstanding_balance || 0)}
          </span>
        </div>

        {/* Next Membership Charge */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Next Membership Charge</span>
          <span className="text-sm font-semibold text-gray-900">
            {financial.next_membership_charge_date_formatted || "N/A"}
          </span>
        </div>

        {/* Recent Fuel */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">
            Recent Fuel{" "}
            {financial.recent_fuel?.date_formatted
              ? `(${financial.recent_fuel.date_formatted})`
              : ""}
          </span>

          <span className="text-sm font-semibold text-gray-900">
            {financial.recent_fuel
              ? formatCurrency(financial.recent_fuel.amount)
              : "$0.00"}
          </span>
        </div>

      </div>
    </div>
  );
}