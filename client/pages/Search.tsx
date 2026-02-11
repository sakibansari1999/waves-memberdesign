import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, Timer, Users } from "lucide-react";
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

  // Generate available dates for next 30 days
  const availableDates = useMemo(() => generateAvailableDates(30), []);

  const locations = locationsData?.data || [];

  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    startTime: "",
    duration: "",
    passengers: "",
  });

  const handleSearch = () => {
    // Build query string with search parameters
    const params = new URLSearchParams();

    // Only add filters that are relevant to /api/fleets
    if (searchParams.location) {
      params.append("location", searchParams.location);
    }

    if (searchParams.date) {
      params.append("date", searchParams.date);
    }

    // Note: startTime, duration, and passengers are for booking flow, not search

    // Navigate to browse page with search params
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&h=900&fit=crop&q=80")',
          minHeight: "calc(100vh - 78px)",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

        {/* Content Container */}
        <div className="relative max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-24">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              Find Your Perfect Boat
            </h1>
            <p className="text-white text-lg md:text-xl font-medium drop-shadow-md">
              Browse our fleet and book your next adventure
            </p>
          </div>

          {/* Search Form Card */}
          <div className="max-w-[960px] mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder={locationsLoading ? "Loading..." : "Any"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-900 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <Select
                  value={searchParams.date}
                  onValueChange={(value) =>
                    setSearchParams({ ...searchParams, date: value })
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300">
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

              {/* Start Time */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-900 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Start Time
                </label>
                <Select
                  value={searchParams.startTime}
                  onValueChange={(value) =>
                    setSearchParams({ ...searchParams, startTime: value })
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00 AM</SelectItem>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">01:00 PM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                    <SelectItem value="16:00">04:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-900 text-sm font-medium">
                  <Timer className="w-4 h-4" />
                  Duration
                </label>
                <Select
                  value={searchParams.duration}
                  onValueChange={(value) =>
                    setSearchParams({ ...searchParams, duration: value })
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="5">5 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
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
                  <SelectTrigger className="bg-white border-gray-300">
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

            {/* Search Button */}
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
