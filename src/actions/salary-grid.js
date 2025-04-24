import useSWR from 'swr';
import { useMemo } from 'react';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const ENDPOINT = endpoints.salaryGrid;

// ----------------------------------------------------------------------

export function useGetSalaryGrids() {
  const url = endpoints.salaryGrid;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      salaryGrids: data?.data?.records || [],
      salaryGridsLoading: isLoading,
      salaryGridsError: error,
      salaryGridsValidating: isValidating,
      salaryGridsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
export function useGetSalaryGrid(salaryGridId) {
  const url = salaryGridId ? [`${endpoints.salaryGrid}/${salaryGridId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      salaryGrid: data?.data,
      salaryGridLoading: isLoading,
      salaryGridError: error,
      salaryGridValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export async function createSalaryGrid(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}
