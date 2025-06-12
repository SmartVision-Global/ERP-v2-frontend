import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

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

export function useGetDutiesResponsibilities(params) {
  // const url = endpoints.task;
  const url = params ? [endpoints.task, { params }] : endpoints.task;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      dutiesResponsibilities: data?.data?.records || [],
      dutiesResponsibilitiesCount: data?.data?.total || 0,
      dutiesResponsibilitiesLoading: isLoading,
      dutiesResponsibilitiesError: error,
      dutiesResponsibilitiesValidating: isValidating,
      dutiesResponsibilitiesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredTasks(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    // headers: {
    //   Authorization: `${process.env.NEXT_PUBLIC_API_KEY}`,
    // },
    params,
  });
  return response;
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
  mutate(ENDPOINT);
}

export async function updateDutyResponsibility(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  mutate(`${ENDPOINT}`);
}
