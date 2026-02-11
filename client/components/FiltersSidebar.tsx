import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Calendar from "./Calendar";
import { useBoatLocations, useBoatTypes, useBoatFeatures } from "@/hooks/useBoatFilters";

interface FiltersSidebarProps {
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
  selectedLocations: string[];
  onLocationsChange: (locations: string[]) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  lengthRange: [number, number];
  onLengthChange: (range: [number, number]) => void;
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
}

export default function FiltersSidebar({
  selectedDate,
  onDateChange,
  selectedLocations,
  onLocationsChange,
  selectedTypes,
  onTypesChange,
  lengthRange,
  onLengthChange,
  selectedFeatures,
  onFeaturesChange,
}: FiltersSidebarProps) {
  // Fetch filter options from API
  const { data: locationsData } = useBoatLocations();
  const { data: typesData } = useBoatTypes();
  const { data: featuresData } = useBoatFeatures();

  const locations = locationsData?.data || [];
  const boatTypes = typesData?.data || [];
  const features = featuresData?.data || [];

  const handleLocationToggle = (location: string) => {
    if (selectedLocations.includes(location)) {
      onLocationsChange(selectedLocations.filter(l => l !== location));
    } else {
      onLocationsChange([...selectedLocations, location]);
    }
  };

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      onFeaturesChange(selectedFeatures.filter(f => f !== feature));
    } else {
      onFeaturesChange([...selectedFeatures, feature]);
    }
  };

  const handleResetFilters = () => {
    onLocationsChange([]);
    onTypesChange([]);
    onLengthChange([16, 30]);
    onFeaturesChange([]);
  };

  return (
    <aside className="w-full lg:w-[365px] bg-white rounded-md p-5 lg:p-7 flex flex-col gap-4 h-fit lg:sticky lg:top-5">
      <Calendar selectedDate={selectedDate} onDateChange={onDateChange} />

      {/* Location */}
      <div className="pt-4 border-t border-gray-500/25">
        <h3 className="text-gray-900 font-semibold text-base mb-3">Location</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="all-locations"
              checked={selectedLocations.length === 0}
              onCheckedChange={() => onLocationsChange([])}
              className="w-[18px] h-[18px] rounded border-gray-500/25 data-[state=checked]:bg-blue-primary data-[state=checked]:border-blue-primary"
            />
            <label
              htmlFor="all-locations"
              className="text-gray-900 text-sm font-medium cursor-pointer"
            >
              All Locations
            </label>
          </div>
          {locations.map((location) => (
            <div key={location} className="flex items-center gap-2.5">
              <Checkbox
                id={`location-${location}`}
                checked={selectedLocations.includes(location)}
                onCheckedChange={() => handleLocationToggle(location)}
                className="w-[18px] h-[18px] rounded border-gray-500/25 data-[state=checked]:bg-blue-primary data-[state=checked]:border-blue-primary"
              />
              <label
                htmlFor={`location-${location}`}
                className="text-gray-900 text-sm font-medium cursor-pointer"
              >
                {location}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Boat Type */}
      <div className="pt-4 border-t border-gray-500/25">
        <h3 className="text-gray-900 font-semibold text-base mb-3">
          Boat Type
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="all-boat-types"
              checked={selectedTypes.length === 0}
              onCheckedChange={() => onTypesChange([])}
              className="w-[18px] h-[18px] rounded border-gray-500/25 data-[state=checked]:bg-blue-primary data-[state=checked]:border-blue-primary"
            />
            <label
              htmlFor="all-boat-types"
              className="text-gray-900 text-sm font-medium cursor-pointer"
            >
              All Boat Types
            </label>
          </div>
          {boatTypes.map((type) => (
            <div key={type} className="flex items-center gap-2.5">
              <Checkbox
                id={`boat-type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
                className="w-[18px] h-[18px] rounded border-gray-500/25 data-[state=checked]:bg-blue-primary data-[state=checked]:border-blue-primary"
              />
              <label
                htmlFor={`boat-type-${type}`}
                className="text-gray-900 text-sm font-medium cursor-pointer"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Boat Length */}
      <div className="pt-4 border-t border-gray-500/25">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 font-semibold text-base">Boat Length</h3>
          <span className="text-gray-900 text-sm">{lengthRange[0]}' - {lengthRange[1]}'</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-blue-primary">
            <span>Min</span>
            <span className="ml-auto">{lengthRange[0]}'</span>
          </div>
          <Slider
            value={lengthRange}
            onValueChange={(value) => onLengthChange(value as [number, number])}
            min={16}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-blue-primary">
            <span>Max</span>
            <span className="ml-auto">{lengthRange[1]}'</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="pt-4 border-t border-gray-500/25">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 font-semibold text-base">Features</h3>
          <button
            onClick={handleResetFilters}
            className="text-blue-primary text-sm font-medium hover:underline"
          >
            Reset
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2.5">
              <Checkbox
                id={`feature-${feature}`}
                checked={selectedFeatures.includes(feature)}
                onCheckedChange={() => handleFeatureToggle(feature)}
                className="w-[18px] h-[18px] rounded border-gray-500/25 data-[state=checked]:bg-blue-primary data-[state=checked]:border-blue-primary"
              />
              <label
                htmlFor={`feature-${feature}`}
                className="text-gray-900 text-sm font-medium cursor-pointer"
              >
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
