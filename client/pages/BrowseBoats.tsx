import { Search, ArrowUpDown, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BoatCard from "@/components/BoatCard";
import FiltersSidebar from "@/components/FiltersSidebar";
import BoatDetailModal from "@/components/BoatDetailModal";
import { useBoats } from "@/hooks/useBoats";
import { BoatFilters } from "@/utils/api";
import { Button } from "@/components/ui/button";

const MIN_LENGTH = 16;
const MAX_LENGTH = 100;

export default function BrowseBoats() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedBoat, setSelectedBoat] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [boatTypes, setBoatTypes] = useState<string[]>([]);
  const [lengthRange, setLengthRange] = useState<[number, number]>([
    MIN_LENGTH,
    MAX_LENGTH,
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [hasSearchParams, setHasSearchParams] = useState(false);

  useEffect(() => {
    const urlLocation = searchParams.get("location");
    const urlDate = searchParams.get("date");
    const urlSlot = searchParams.get("slot");

    if (urlLocation || urlDate || urlSlot) {
      setHasSearchParams(true);

      if (urlLocation && urlLocation !== "any") {
        setLocations([urlLocation]);
      }

      if (urlDate) {
        setSelectedDate(urlDate);
      }

      if (urlSlot) {
        setSlot(urlSlot);
      }
    } else {
      setHasSearchParams(false);
    }
  }, [searchParams]);

  const filters: BoatFilters = useMemo(
    () => ({
      search: searchQuery || undefined,
      date: selectedDate || undefined,
      slot: slot || undefined,
      location: locations.length > 0 ? locations : undefined,
      boat_type: boatTypes.length > 0 ? boatTypes : undefined,
      length_min: lengthRange[0],
      length_max: lengthRange[1],
      features: selectedFeatures.length > 0 ? selectedFeatures : undefined,
      sort: sortBy,
      order: sortOrder,
      per_page: 12,
    }),
    [
      searchQuery,
      selectedDate,
      slot,
      locations,
      boatTypes,
      lengthRange,
      selectedFeatures,
      sortBy,
      sortOrder,
    ],
  );

  const { data: boatsResponse, isLoading, error } = useBoats(filters);

  const handleViewBoat = (boat: any) => {
    setSelectedBoat(boat);
    setIsModalOpen(true);
  };

const handleDirectSelectBoat = (boat: any) => {
  navigate("/booking", {
    state: {
      boat,
      selectedDate,
      slot,
    },
  });
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBoat(null), 300);
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDate(null);
    setSlot(null);
    setLocations([]);
    setBoatTypes([]);
    setLengthRange([MIN_LENGTH, MAX_LENGTH]);
    setSelectedFeatures([]);
    setSortBy("created_at");
    setSortOrder("desc");
    setHasSearchParams(false);

    setSearchParams({});
  };

  const boats = boatsResponse?.data || [];

  const formatDateDisplay = (dateString: string | null) => {
    if (!dateString) return "Select a date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-5 flex flex-col lg:flex-row gap-5 lg:gap-10">
        <div className="hidden lg:block">
          <FiltersSidebar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedLocations={locations}
            onLocationsChange={setLocations}
            selectedTypes={boatTypes}
            onTypesChange={setBoatTypes}
            lengthRange={lengthRange}
            onLengthChange={setLengthRange}
            selectedFeatures={selectedFeatures}
            onFeaturesChange={setSelectedFeatures}
          />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between gap-4">

          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-gray-900 text-2xl font-semibold mb-1">
                {formatDateDisplay(selectedDate)}
              </h1>
              <p className="text-gray-500 text-sm">
                {isLoading
                  ? "Loading..."
                  : `${boats.length} boat${boats.length !== 1 ? "s" : ""} found`}
              </p>
              {slot && (
                <p className="text-sm text-gray-500 mt-1">
                  Slot: {slot === "full-day" ? "Full Day" : slot}
                </p>
              )}
            </div>

            {hasSearchParams && (
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset Filters
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-[206px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search... Boats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#EEF2F8] rounded-xl text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-primary"
              />
            </div>

            <button
              onClick={toggleSort}
              className="flex items-center gap-2 px-4 py-2 text-gray-900 font-medium text-base hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowUpDown className="w-5 h-5" />
              <span>Sort</span>
            </button>
          </div>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary"></div>
                <p className="mt-2 text-gray-600">Loading boats...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 mb-6">
              <p className="font-medium">Error loading boats</p>
              <p className="text-sm">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong"}
              </p>
            </div>
          )}

          {!isLoading && boats.length > 0 && (
            <div className="flex flex-col gap-5">
              {boats.map((boat) => (
                <BoatCard
                  key={boat.id}
                  id={boat.id}
                  name={boat.boat_name}
                  type={boat.type}
                  category={boat.category}
                  image={boat.image || ""}
                  location={boat.location}
                  boatType={boat.boatType}
                  length={boat.length}
                  guests={boat.capacity}
                  features={boat.features}
                  pricePerHour={boat.fare}
                  badge={boat.badge}
                  includedWithMembership={boat.includedWithMembership}
                  onViewBoat={() => handleViewBoat(boat)}
                  onSelectBoat={() => handleDirectSelectBoat(boat)}
                />
              ))}
            </div>
          )}

          {!isLoading && boats.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No boats found matching your criteria
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </main>

      {selectedBoat && (
       <BoatDetailModal
  boat={selectedBoat}
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  selectedDate={selectedDate}
  slot={slot}
/>
      )}
    </div>
  );
}