import { MapPin, Sailboat, Ruler, Users } from "lucide-react";

interface BoatCardProps {
  id: string;
  name: string;
  type: string;
  category: string;
  image: string;
  location: string;
  boatType: string;
  length: string;
  guests: number;
  features: string[];
  pricePerHour?: number;
  badge?: "most-booked" | "unavailable" | null;
  includedWithMembership?: boolean;
  onSelectBoat?: () => void;
}

export default function BoatCard({
  id,
  name,
  type,
  category,
  image,
  location,
  boatType,
  length,
  guests,
  features,
  pricePerHour,
  badge,
  includedWithMembership,
  onSelectBoat,
}: BoatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col lg:flex-row gap-5 p-5 relative">
      {/* Image */}
      <div className="relative w-full lg:w-[218px] h-[218px] flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
        {badge && (
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${
              badge === "most-booked"
                ? "bg-green-badge text-white"
                : "bg-red-badge text-white"
            }`}
          >
            {badge === "most-booked" ? "Most Booked" : "Unavailable"}
          </div>
        )}
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-gray-900 text-xl font-semibold">{name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-gray-900 text-xs">{type}</span>
              <span className="w-0.5 h-0.5 bg-gray-900 rounded-full"></span>
              <span className="text-gray-900 text-xs">{category}</span>
            </div>
            <div className="text-gray-500 text-xs mt-1">{id}</div>
          </div>
          {pricePerHour && (
            <div className="text-right">
              <div className="text-blue-primary text-2xl font-bold">
                ${pricePerHour}
                <span className="text-sm font-normal">/hr</span>
              </div>
            </div>
          )}
          {includedWithMembership && (
            <div className="px-2 py-1 rounded-lg border border-blue-primary/64 bg-blue-primary/11">
              <span className="text-blue-primary text-xs font-normal">
                Included with Membership
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-3 text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="w-[18px] h-[18px]" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sailboat className="w-[18px] h-[18px]" />
            <span>{boatType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="w-[18px] h-[18px]" />
            <span>{length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-[18px] h-[18px]" />
            <span>{guests} Guests</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {features.map((feature) => (
            <span
              key={feature}
              className="px-2 py-1 rounded-lg bg-gray-200 text-gray-900 text-xs"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex gap-5 mt-auto">
        
          <button
            onClick={onSelectBoat}
            className="flex-1 py-3 px-4 bg-blue-primary text-white font-semibold text-base rounded-md hover:bg-blue-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={badge === "unavailable"}
          >
            Select Boat
          </button>
        </div>
      </div>
    </div>
  );
}
