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

export default function UsageStats() {
  return (
    <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-[320px] xl:w-[376px] flex-shrink-0">
      <StatCard
        label="Hours This Month"
        value="12.5"
        subtitle="Top 10% of members"
      />
      <StatCard
        label="Upcoming Hours"
        value="6.0"
        subtitle="2 reservations pending"
      />
      <StatCard
        label="Lifetime Trips"
        value="48"
        subtitle="Member since 2021"
      />
    </div>
  );
}
