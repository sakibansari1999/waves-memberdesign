import { useQuery } from '@tanstack/react-query';
import { fetchBoats, BoatFilters, BoatListResponse } from '@/utils/api';

/**
 * Hook to fetch boats with React Query caching
 */
export function useBoats(filters: BoatFilters = {}) {
  return useQuery<BoatListResponse>({
    queryKey: ['boats', filters],
    queryFn: () => fetchBoats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
