import { useQuery } from '@tanstack/react-query';
import { fetchMyBookings, MyBookingsResponse } from '@/utils/api';

/**
 * Hook to fetch user's bookings with optional status filter
 * @param status - Filter by status: 'upcoming', 'past', 'cancelled', etc.
 */
export function useMyBookings(status?: string) {
  return useQuery<MyBookingsResponse>({
    queryKey: ['myBookings', status],
    queryFn: () => fetchMyBookings(status),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}
