import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Sun, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBoatLocations } from "@/hooks/useBoatFilters";
import { generateAvailableDates, formatDateForDisplay } from "@/utils/dateHelper";

export default function Search() {
  const navigate = useNavigate();
  const { data: locationsData, isLoading: locationsLoading } = useBoatLocations();

  const availableDates = useMemo(() => generateAvailableDates(30), []);
  const locations = locationsData?.data || [];

  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    slot: "",
    passengers: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchParams.location && searchParams.location !== "any") {
      params.append("location", searchParams.location);
    }

    if (searchParams.date) {
      params.append("date", searchParams.date);
    }

    if (searchParams.slot && searchParams.slot !== "any") {
      params.append("slot", searchParams.slot);
    }

    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&h=900&fit=crop&q=80")',
          minHeight: "calc(100vh - 78px)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

        <div className="relative max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              Find Your Perfect Boat
            </h1>
            <p className="text-white text-lg md:text-xl font-medium drop-shadow-md">
              Browse our fleet and book your next adventure
            </p>
          </div>

          <div className="max-w-[960px] mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-900 text-sm font-medium">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <Select
                  value={searchParams.location}
                  onValueChange={(value) =>
                    setSearchParams({ ...searchParams, location: value })
                  }
                  disabled={locationsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={locationsLoading ? "Loading..." : "Any"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date (Start Date) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-900 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <Select
                  value={searchParams.date}
                  onValueChange={(value) =>
                    setSearchParams({ ...searchParams, date: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDates.map((date) => (
                      <SelectItem key={date} value={date}>
                        {formatDateForDisplay(date)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Slot */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-900 text-sm font-medium">
                  <Sun className="w-4 h-4" />
                  Slot
                </label>
                <Select
                  value={searchParams.slot}
                  onValueChange={(value) =>
                    setSearchParams({ ...searchParams, slot: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                    <SelectItem value="full-day">Full Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Passengers */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-900 text-sm font-medium">
                  <Users className="w-4 h-4" />
                  Passengers
                </label>
                <Select
                  value={searchParams.passengers}
                  onValueChange={(value) =>
                    setSearchParams({ ...searchParams, passengers: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="2">2 guests</SelectItem>
                    <SelectItem value="4">4 guests</SelectItem>
                    <SelectItem value="6">6 guests</SelectItem>
                    <SelectItem value="8">8 guests</SelectItem>
                    <SelectItem value="10">10+ guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <Button
              onClick={handleSearch}
              className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white py-6 text-base font-semibold"
            >
              Search Boats
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}