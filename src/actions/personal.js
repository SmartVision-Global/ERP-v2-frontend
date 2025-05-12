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

const ENDPOINT = endpoints.personal;

// ----------------------------------------------------------------------

export function useGetPersonals(params) {
  // const url = endpoints.personal;
  const url = params ? [endpoints.personal, { params }] : endpoints.personal;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      personals: data?.data?.records || [],
      personalsCount: data?.data?.total || 0,

      personalsLoading: isLoading,
      personalsError: error,
      personalsValidating: isValidating,
      personalsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredPersonals(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

// ----------------------------------------------------------------------

export function useGetPersonal(personalId) {
  const url = personalId ? [`${endpoints.personal}/${personalId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      personal: data?.data,
      personalLoading: isLoading,
      personalError: error,
      personalValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createPersonal(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);

  //   mutate(endpoints.site);
}

export async function updatePersonal(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  //   mutate(endpoints.site);
}

export async function validatePersonal(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/validate`, data);
  //   mutate(endpoints.site);
}
