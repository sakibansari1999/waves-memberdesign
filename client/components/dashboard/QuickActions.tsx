import { Link } from "react-router-dom";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

function QuickActionCard({ icon, label, to }: QuickActionProps) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-3 bg-white rounded-lg border border-black/[0.08] px-4 py-6 flex-1 hover:shadow-md hover:border-black/[0.12] transition-all"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F5F7FA]">
        {icon}
      </div>
      <span className="text-sm font-semibold text-gray-900 text-center">
        {label}
      </span>
    </Link>
  );
}

export default function QuickActions() {
  const actions = [
    {
      label: "Book a Boat",
      to: "/browse",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 10.189V14M12 2V5M19 13V7C19 5.89617 18.1038 5 17 5H7C5.89617 5 5 5.89617 5 7V13" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.3796 20.0002C20.4553 18.1848 21.0154 16.1103 20.9996 14.0002L12.8116 10.3612C12.2946 10.1315 11.7046 10.1315 11.1876 10.3612L2.99959 14.0002C2.95329 16.8439 3.9533 19.6055 5.80959 21.7602" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 21C2.6 21.5 3.2 22 4.5 22C7 22 7 20 9.5 20C10.8 20 11.4 20.5 12 21C12.6 21.5 13.2 22 14.5 22C17 22 17 20 19.5 20C20.8 20 21.4 20.5 22 21" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Reservations",
      to: "/my-trips",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8 2V6M16 2V6" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
          <path d="M5 4H19C20.1038 4 21 4.89617 21 6V20C21 21.1038 20.1038 22 19 22H5C3.89617 22 3 21.1038 3 20V6C3 4.89617 3.89617 4 5 4Z" stroke="#111827" strokeWidth="2"/>
          <path d="M3 10H21" stroke="#111827" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      label: "Invoices",
      to: "/billing",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 2V22L6 21L8 22L10 21L12 22L14 21L16 22L18 21L20 22V2" stroke="#111827" strokeWidth="2"/>
          <path d="M16 8H10C8.89617 8 8 8.89617 8 10C8 11.1038 8.89617 12 10 12H14" stroke="#111827" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      label: "Profile",
      to: "/profile",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 21V19C19 16.7923 17.2077 15 15 15H9C6.79234 15 5 16.7923 5 19V21" stroke="#111827" strokeWidth="2"/>
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#111827" strokeWidth="2"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-row gap-4 w-full flex-wrap sm:flex-nowrap">
      {actions.map((action, i) => (
        <QuickActionCard key={i} {...action} />
      ))}
    </div>
  );
}