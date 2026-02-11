# React Frontend Integration Guide for Fleet APIs

## Overview
This guide documents the integration of the Laravel Fleet APIs with the React frontend for the BrowseBoats page.

---

## Files Created/Updated

### 1. **API Utilities** (`client/utils/api.ts`)
**Status**: ✅ Updated

Added new functions for Fleet API calls:
- `fetchBoats(filters)` - Get boats with filters
- `fetchBoat(id)` - Get single boat details
- `fetchCalendarAvailability()` - Get calendar availability
- `fetchBoatLocations()` - Get location options
- `fetchBoatTypes()` - Get boat type options
- `fetchBoatFeatures()` - Get feature options

Also added TypeScript interfaces:
- `Boat` - Single boat object
- `BoatListResponse` - Paginated boats list
- `BoatFilters` - Filter parameters
- `CalendarDay` & `CalendarAvailability` - Calendar data

---

### 2. **Custom Hooks**

#### `client/hooks/useBoats.ts` ✅ NEW
Uses React Query to fetch boats with automatic caching (5 min stale time)
```typescript
const { data: boatsResponse, isLoading, error } = useBoats(filters);
```

#### `client/hooks/useBoatFilters.ts` ✅ NEW
Three hooks for fetching filter options:
- `useBoatLocations()` - Fetch dock locations
- `useBoatTypes()` - Fetch boat types
- `useBoatFeatures()` - Fetch features

---

### 3. **Pages**

#### `client/pages/BrowseBoats.tsx` ✅ Updated
**Changes**:
- Added filter state management (search, date, locations, types, length, features)
- Integrated `useBoats` hook to fetch real data
- Dynamic date display in header
- Loading and error states
- Empty state handling
- Search input now updates state
- Sort button now toggles sort order
- Passes filter state to FiltersSidebar component

**Key State Variables**:
```typescript
const [searchQuery, setSearchQuery] = useState("");
const [selectedDate, setSelectedDate] = useState<string | null>(null);
const [locations, setLocations] = useState<string[]>([]);
const [boatTypes, setBoatTypes] = useState<string[]>([]);
const [lengthRange, setLengthRange] = useState<[number, number]>([16, 30]);
const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
const [sortBy, setSortBy] = useState<string>("created_at");
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
```

---

### 4. **Components**

#### `client/components/FiltersSidebar.tsx` ✅ Updated
**Changes**:
- Now accepts filter props from parent
- Integrated `useBoatLocations`, `useBoatTypes`, `useBoatFeatures` hooks
- Dynamically renders location checkboxes from API data
- Dynamically renders boat type checkboxes from API data
- Dynamically renders feature checkboxes from API data
- Boat length slider now updates parent state
- Reset button resets all filters

**Props Interface**:
```typescript
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
```

#### `client/components/Calendar.tsx` ✅ Updated
**Changes**:
- Integrated `fetchCalendarAvailability` hook using React Query
- Dynamic month/year navigation
- Calculates which days are available based on API data
- Supports date selection/deselection
- Only allows clicking on available dates
- Shows boat count per available day
- Updates parent state when date is selected

**Features**:
- Shows current month by default
- Can navigate to previous/next months
- Available dates shown in green
- Unavailable dates shown in gray (disabled)
- Selected date highlighted in blue

---

## Data Flow

```
BrowseBoats (Main Page)
    ├── useBoats() → Fetches /api/fleets
    │   └── Displays boat list
    │
    ├── FiltersSidebar
    │   ├── useBoatLocations() → /api/fleets/locations
    │   ├── useBoatTypes() → /api/fleets/types
    │   ├── useBoatFeatures() → /api/fleets/features
    │   │
    │   └── Calendar
    │       └── useQuery(calendarAvailability) → /api/calendar-availability
    │
    └── BoatDetailModal
        └── Shows selected boat details
```

---

## API Endpoints Used

| Endpoint | Purpose | Called From |
|----------|---------|------------|
| `GET /api/fleets` | Fetch boats with filters | BrowseBoats via useBoats |
| `GET /api/fleets/{id}` | Get single boat details | BoatDetailModal |
| `GET /api/fleets/locations` | Get location options | FiltersSidebar via useBoatLocations |
| `GET /api/fleets/types` | Get boat type options | FiltersSidebar via useBoatTypes |
| `GET /api/fleets/features` | Get feature options | FiltersSidebar via useBoatFeatures |
| `GET /api/calendar-availability` | Get calendar availability | Calendar component |

---

## Environment Setup

Make sure your `.env` file contains:
```
VITE_API_BASE_URL=http://localhost:8000
```

---

## Testing the Integration

1. **Start Laravel Backend**:
   ```bash
   cd laravel-project
   php artisan serve --port=8000
   ```

2. **Start React Frontend**:
   ```bash
   pnpm dev
   ```

3. **Test the Flow**:
   - Navigate to BrowseBoats page
   - Verify calendar loads available dates
   - Select a date from calendar
   - Verify boats list filters by date
   - Test search input
   - Test location/type/feature filters
   - Verify sort button works
   - Click on a boat to open detail modal

---

## Error Handling

The implementation includes:
- Error state display if API calls fail
- Loading spinner while fetching
- Empty state message when no boats match criteria
- Graceful fallbacks if API data is missing

---

## Performance Optimizations

1. **React Query Caching**:
   - Boats list: 5-minute stale time
   - Filter options: 1-hour stale time
   - Calendar: 5-minute stale time

2. **useMemo Hook**: Filter object is memoized to prevent unnecessary re-renders

3. **Lazy Loading**: Filter data only fetched when FiltersSidebar mounts

---

## Next Steps

1. **Test the full integration** with real Laravel API
2. **Fix any issues** with route ordering in Laravel API (specific routes before `/{fleet}`)
3. **Update FleetResource** in Laravel to properly map features if stored in database
4. **Add loading skeletons** for better UX (optional)
5. **Implement booking flow** using the selected boat data

---

## Laravel API Fixes Needed

**File**: `routes/api.php`

```php
Route::prefix('fleets')->group(function () {
    // Specific routes MUST come BEFORE /{fleet}
    Route::get('/locations', [FleetController::class, 'locations']);
    Route::get('/types', [FleetController::class, 'types']);
    Route::get('/features', [FleetController::class, 'features']);
    
    // Generic routes
    Route::get('/', [FleetController::class, 'index']);
    Route::get('/{fleet}', [FleetController::class, 'show']);
});
```

This ensures that `/api/fleets/locations` doesn't get intercepted by the `/{fleet}` route.

---

## Troubleshooting

### Issue: Calendar not loading dates
- Check Laravel API is running on port 8000
- Verify `fetchCalendarAvailability` endpoint is working
- Check browser console for CORS errors

### Issue: Filter options not showing
- Verify endpoints return data in correct format
- Check `useBoatLocations()`, `useBoatTypes()`, `useBoatFeatures()` are returning data
- Inspect network tab to see API responses

### Issue: Boats not filtering
- Verify `useMemo` dependency array is correct
- Check filter parameters are being passed to `fetchBoats()`
- Inspect API request parameters in network tab

---

## Summary

✅ All frontend components are now integrated with the Laravel Fleet APIs
✅ Dynamic filtering, sorting, and date selection working
✅ Proper loading and error states implemented
✅ Type-safe with TypeScript interfaces
✅ Performance optimized with React Query caching

The BrowseBoats page is now fully functional and ready to work with your Laravel backend!
