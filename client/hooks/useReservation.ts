import { useQuery, useMutation } from '@tanstack/react-query';
import {
  fetchAvailableDates,
  fetchAvailableTimes,
  fetchDestinations,
  checkAvailability,
  createReservation,
  fetchReservation,
  AvailableDateResponse,
  AvailableTimesResponse,
  DestinationsResponse,
  AvailabilityCheck,
  ReservationResponse,
  BookingPayload,
} from '@/utils/api';

/**
 * Hook to fetch available dates for a boat
 */
export function useAvailableDates(fleetId: number | null, month?: number, year?: number) {
  return useQuery<AvailableDateResponse>({
    queryKey: ['available-dates', fleetId, month, year],
    queryFn: () => fetchAvailableDates(fleetId!, month, year),
    enabled: !!fleetId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}

/**
 * Hook to fetch available time slots for a specific date
 */
export function useAvailableTimes(fleetId: number | null, date: string | null) {
  return useQuery<AvailableTimesResponse>({
    queryKey: ['available-times', fleetId, date],
    queryFn: () => fetchAvailableTimes(fleetId!, date!),
    enabled: !!fleetId && !!date,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to fetch destinations
 */
export function useDestinations() {
  return useQuery<DestinationsResponse>({
    queryKey: ['destinations'],
    queryFn: () => fetchDestinations(),
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    retry: 1,
  });
}

/**
 * Hook to check real-time availability
 */
export function useCheckAvailability() {
  return useMutation({
    mutationFn: ({
      fleetId,
      date,
      startTime,
      durationHours,
    }: {
      fleetId: number;
      date: string;
      startTime: string;
      durationHours: number;
    }) => checkAvailability(fleetId, date, startTime, durationHours),
  });
}

/**
 * Hook to create a reservation
 */
export function useCreateReservation() {
  return useMutation({
    mutationFn: (payload: BookingPayload) => createReservation(payload),
  });
}

/**
 * Hook to fetch reservation details
 */
export function useFetchReservation(reservationId: number | null) {
  return useQuery<ReservationResponse>({
    queryKey: ['reservation', reservationId],
    queryFn: () => fetchReservation(reservationId!),
    enabled: !!reservationId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
