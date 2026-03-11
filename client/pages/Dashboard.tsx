import ReservationCard from "@/components/dashboard/ReservationCard";
import UsageStats from "@/components/dashboard/UsageStats";
import QuickActions from "@/components/dashboard/QuickActions";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import RecentActivities from "@/components/dashboard/RecentActivities";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-12">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-bold text-gray-900 tracking-tight leading-tight">
              Good morning, Ankush.
            </h1>
            <p className="text-base text-gray-500">
              You have a booking coming up this Friday.
            </p>
          </div>
          <p className="text-[13px] text-gray-500 sm:text-right whitespace-nowrap">
            Membership renews{" "}
            <span className="font-semibold text-gray-900">Nov 2025</span>
          </p>
        </div>

        {/* Hero Section: Reservation Card + Stats */}
        <div className="flex flex-col lg:flex-row gap-6">
          <ReservationCard />
          <UsageStats />
        </div>

        {/* Quick Action Cards */}
        <QuickActions />

        {/* Bottom Split: Financial + Activities */}
        <div className="flex flex-col md:flex-row gap-12">
          <FinancialOverview />
          <RecentActivities />
        </div>
      </main>
    </div>
  );
}
