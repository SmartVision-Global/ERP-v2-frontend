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

const ENDPOINT = endpoints.function;

// ----------------------------------------------------------------------

export function useGetJobs(params) {
  // const url = endpoints.function;
  const url = params ? [endpoints.function, { params }] : endpoints.function;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      jobs: data?.data?.records || [],
      jobsCount: data?.data?.total || 0,
      jobsLoading: isLoading,
      jobsError: error,
      jobsValidating: isValidating,
      jobsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
export async function getFiltredJobs(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetJob(productId) {
  const url = productId ? [`${endpoints.function}/${productId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      job: data?.data,
      jobLoading: isLoading,
      jobError: error,
      jobValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createJob(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  mutate(ENDPOINT);
}

export async function updateJob(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  mutate(ENDPOINT);
}

export async function validateJob(id, params) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/validate`);
  mutate([ENDPOINT, { params }]);
}

export async function archiveJob(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.delete(`${ENDPOINT}/${id}`);
  // mutate(`${ENDPOINT}/${id}`);
}
