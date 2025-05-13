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

export function useGetSalaryGrids(params) {
  const url = params ? [endpoints.salaryGrid, { params }] : endpoints.salaryGrid;
  // const url = endpoints.salaryGrid;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      salaryGrids: data?.data?.records || [],
      salaryGridsCount: data?.data?.total || 0,

      salaryGridsLoading: isLoading,
      salaryGridsError: error,
      salaryGridsValidating: isValidating,
      salaryGridsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredSalaryGrids(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
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

export async function updateSalaryGrid(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  //   mutate(endpoints.site);
}
