import useSWR from 'swr';
import { useMemo } from 'react';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

const ENDPOINT = endpoints.task;

// ----------------------------------------------------------------------

export function useGetDutiesResponsibilities() {
  const url = endpoints.task;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      dutiesResponsibilities: data?.data?.records || [],
      dutiesResponsibilitiesLoading: isLoading,
      dutiesResponsibilitiesError: error,
      dutiesResponsibilitiesValidating: isValidating,
      dutiesResponsibilitiesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetDutyResponsibility(personalId) {
  const url = personalId ? [`${endpoints.task}/${personalId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      dutyResponsibility: data?.data,
      dutyResponsibilityLoading: isLoading,
      dutyResponsibilityError: error,
      dutyResponsibilityValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createDutyResponsibility(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}

export async function updateDutyResponsibility(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  // mutate(`${ENDPOINT}/${id}`);
}
