import React from "react";

interface Activity {
  type: string;
  title: string;
  subtitle: string;
  time_ago?: string | null;
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function ActivityRow({ icon, title, subtitle }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F3F4F6] flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-900 truncate">{title}</span>
        <span className="text-xs text-gray-500">{subtitle}</span>
      </div>
    </div>
  );
}

function getIcon(type: string) {
  switch (type) {
    case "trip_completed":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 4.5V16.5M14.25 9.75L15.75 9C15.75 12.7254 12.7254 15.75 9 15.75C5.27457 15.75 2.25 12.7254 2.25 9L3.75 9.75M6.75 8.25H11.25" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5 3C7.5 3.82787 8.17213 4.5 9 4.5C9.82787 4.5 10.5 3.82787 10.5 3C10.5 2.17213 9.82787 1.5 9 1.5C8.17213 1.5 7.5 2.17213 7.5 3Z" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );

    case "fuel_charge":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M10.5 9.75H12C12.8279 9.75 13.5 10.4221 13.5 11.25V12.75C13.5 13.5779 14.1721 14.25 15 14.25C15.8279 14.25 16.5 13.5779 16.5 12.75V7.5015C16.5003 7.10172 16.341 6.71835 16.0575 6.4365L13.5 3.75M10.5 15.75V3.75C10.5 2.92213 9.82787 2.25 9 2.25H3.75C2.92213 2.25 2.25 2.92213 2.25 3.75V15.75M1.5 15.75H11.25M2.25 6.75H10.5" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );

    case "invoice_paid":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 3.75H15C15.8279 3.75 16.5 4.42213 16.5 5.25V12.75C16.5 13.5779 15.8279 14.25 15 14.25H3C2.17213 14.25 1.5 13.5779 1.5 12.75V5.25C1.5 4.42213 2.17213 3.75 3 3.75Z" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.5 7.5H16.5" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );

    default:
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke="#9CA3AF" strokeWidth="1.5" />
        </svg>
      );
  }
}

export default function RecentActivities({ activities }: { activities: Activity[] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col gap-6 flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
        <div className="bg-white border border-black/[0.06] rounded-lg p-6 text-center text-sm text-gray-500">
          No recent activities
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 flex-1 min-w-0">
      <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>

      <div className="flex flex-col divide-y divide-black/[0.06]">
        {activities.map((activity, i) => (
          <ActivityRow
            key={i}
            icon={getIcon(activity.type)}
            title={activity.title}
            subtitle={`${activity.subtitle}${activity.time_ago ? " · " + activity.time_ago : ""}`}
          />
        ))}
      </div>
    </div>
  );
}