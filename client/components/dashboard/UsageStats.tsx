interface UsageStatsProps {
  stats: {
    hours_this_month: number;
    hours_this_month_subtitle: string;
    upcoming_hours: number;
    upcoming_hours_subtitle: string;
    lifetime_trips: number;
    lifetime_trips_subtitle: string;
  };
}

interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
}

function StatCard({ label, value, subtitle }: StatCardProps) {
  return (
    <div className="flex flex-col justify-center bg-white rounded-lg border border-black/[0.08] p-6 flex-1">
      <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className="text-[28px] font-bold text-gray-900 tracking-tight leading-none mb-1">
        {value}
      </p>
      <p className="text-[13px] text-gray-500">{subtitle}</p>
    </div>
  );
}

export default function UsageStats({ stats }: UsageStatsProps) {
  const formatNumber = (num: number) => {
    return Number(num || 0).toFixed(1);
  };

  if (!stats) {
    return null;
  }

  return (
    <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-[320px] xl:w-[376px] flex-shrink-0">
      
      <StatCard
        label="Hours This Month"
        value={formatNumber(stats.hours_this_month)}
        subtitle={stats.hours_this_month_subtitle || "—"}
      />

      <StatCard
        label="Upcoming Hours"
        value={formatNumber(stats.upcoming_hours)}
        subtitle={stats.upcoming_hours_subtitle || "—"}
      />

      <StatCard
        label="Lifetime Trips"
        value={(stats.lifetime_trips ?? 0).toString()}
        subtitle={stats.lifetime_trips_subtitle || "—"}
      />

    </div>
  );
}