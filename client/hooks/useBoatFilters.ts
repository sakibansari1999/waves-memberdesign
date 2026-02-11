import { useQuery } from '@tanstack/react-query';
import { 
  fetchBoatLocations, 
  fetchBoatTypes, 
  fetchBoatFeatures 
} from '@/utils/api';

/**
 * Hook to fetch boat locations for filter dropdown
 */
export function useBoatLocations() {
  return useQuery({
    queryKey: ['boat-locations'],
    queryFn: () => fetchBoatLocations(),
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to fetch boat types for filter dropdown
 */
export function useBoatTypes() {
  return useQuery({
    queryKey: ['boat-types'],
    queryFn: () => fetchBoatTypes(),
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to fetch boat features for filter checkboxes
 */
export function useBoatFeatures() {
  return useQuery({
    queryKey: ['boat-features'],
    queryFn: () => fetchBoatFeatures(),
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
  });
}
