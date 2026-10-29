import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchBoats, BoatFilters, BoatListResponse } from "@/utils/api";

export function useInfiniteBoats(filters: BoatFilters = {}) {
  return useInfiniteQuery({
    queryKey: ["boats", filters],

    queryFn: ({ pageParam = 1 }) =>
      fetchBoats({
        ...filters,
        page: pageParam as number,
        per_page: 12,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage: BoatListResponse) => {
      const { current_page, last_page } = lastPage.pagination;

      return current_page < last_page ? current_page + 1 : undefined;
    },
  });
}
