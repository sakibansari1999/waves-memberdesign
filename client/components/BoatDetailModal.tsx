import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Ruler,
  Gauge,
  Fuel,
  Users,
  Info,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface BoatDetails {
  id: string;
  name: string;
  type: string;
  category: string;
  images: string[];
  location: string;
  length: string;
  motor: string;
  fuelCapacity: string;
  capacity: string;
  features: string[];
  description: string;
  notes: string;
  dockInstructions: string;
  lastBooked?: string;
  yourNotes?: string;
  includedWithMembership?: boolean;
  badge?: "most-booked" | "unavailable" | null;
}

interface BoatDetailModalProps {
  boat: BoatDetails;
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string | null;
  slot?: string | null;
}

export default function BoatDetailModal({
  boat,
  isOpen,
  onClose,
  selectedDate,
  slot,
}: BoatDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectBoat = () => {
    navigate("/booking", {
      state: {
        boat,
        selectedDate,
        slot,
      },
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % boat.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + boat.images.length) % boat.images.length,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/20 pt-20 pb-10 px-4">
      <div className="relative w-full max-w-[854px] bg-white rounded-lg shadow-2xl">
        <div className="relative w-full h-[355px] bg-gray-100">
          <img
            src={boat.images[currentImageIndex]}
            alt={`${boat.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {boat.badge === "most-booked" && (
            <div className="absolute top-5 left-4 px-2 py-1 rounded-lg bg-green-badge text-white text-xs">
              Most Reserved
            </div>
          )}

          {boat.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/43 hover:bg-white/60 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/43 hover:bg-white/60 rounded-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>
            </>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-gray-900 text-2xl font-semibold mb-1">
                {boat.name}
              </h2>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-gray-900 text-sm">{boat.type}</span>
              </div>
            </div>

            {boat.includedWithMembership && (
              <div className="px-2 py-1 rounded-lg border border-blue-primary/64 bg-blue-primary/11">
                <span className="text-blue-primary text-xs">
                  Member Booking - No Charge
                </span>
              </div>
            )}
          </div>

          <p className="text-gray-900 text-sm mb-6">{boat.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-[18px] h-[18px] text-blue-primary" />
              <span className="text-gray-500 text-xs text-center">
                Location
              </span>
              <span className="text-gray-900 text-sm font-medium text-center">
                {boat.location}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-lg">
              <Ruler className="w-[18px] h-[18px] text-blue-primary" />
              <span className="text-gray-500 text-xs text-center">Length</span>
              <span className="text-gray-900 text-sm font-medium text-center">
                {boat.length}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-lg">
              <Gauge className="w-[18px] h-[18px] text-blue-primary" />
              <span className="text-gray-500 text-xs text-center">Motor</span>
              <span className="text-gray-900 text-sm font-medium text-center leading-tight">
                {boat.motor}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-lg">
              <Fuel className="w-[18px] h-[18px] text-blue-primary" />
              <span className="text-gray-500 text-xs text-center">
                Fuel Capacity
              </span>
              <span className="text-gray-900 text-sm font-medium text-center">
                {boat.fuelCapacity}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-lg">
              <Users className="w-[18px] h-[18px] text-blue-primary" />
              <span className="text-gray-500 text-xs text-center">
                Capacity
              </span>
              <span className="text-gray-900 text-sm font-medium text-center leading-tight">
                {boat.capacity}
              </span>
            </div>
          </div>

          {boat.features && boat.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-gray-900 text-base font-medium mb-4">
                Features
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {boat.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 rounded-lg bg-gray-200 text-gray-900 text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {boat.notes && boat.notes.trim() !== "" && (
            <div className="mb-6">
              <h3 className="text-gray-900 text-base font-medium mb-2">
                Notes
              </h3>
              <p className="text-gray-900 text-sm">{boat.notes}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-gray-900 text-base font-medium mb-2">
              Dock Instructions
            </h3>
            <p className="text-gray-900 text-sm">{boat.dockInstructions}</p>
          </div>

          {boat.lastBooked && (
            <div className="p-5 border border-yellow-600 bg-yellow-600/9 rounded-lg mb-6">
              <h3 className="text-gray-900 text-base font-medium mb-2">
                Last Reserved by You
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {boat.lastBooked
                  ? new Date(boat.lastBooked).toLocaleDateString("en-US")
                  : ""}
              </p>
              {boat.yourNotes && (
                <>
                  <h4 className="text-gray-900 text-base font-medium mb-2">
                    Your Notes
                  </h4>
                  <p className="text-gray-900 text-sm">{boat.yourNotes}</p>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg mb-6">
            <Info className="w-5 h-5 text-blue-primary flex-shrink-0" />
            <p className="text-gray-500 text-xs">
              No payment is required now. Fuel and usage charges will be billed
              after your trip.
            </p>
          </div>

          <div className="flex gap-5">
            <button
              onClick={handleSelectBoat}
              className="flex-1 py-3 px-4 bg-blue-primary text-white font-semibold text-base rounded-md hover:bg-blue-primary/90 transition-colors"
            >
              Select Boat
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
        >
          <X className="w-6 h-6 text-gray-900" />
        </button>
      </div>
    </div>
  );
}