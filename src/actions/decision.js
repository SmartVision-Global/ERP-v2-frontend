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

const ENDPOINT = endpoints.decision;

// ----------------------------------------------------------------------

export function useGetDecisions(params) {
  const url = params ? [endpoints.decision, { params }] : endpoints.decision;

  // const url = endpoints.decision;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      decisions: data?.data?.records || [],
      decisionsCount: data?.data?.total || 0,

      decisionsLoading: isLoading,
      decisionsError: error,
      decisionsValidating: isValidating,
      decisionsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function getFiltredDecisions(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetDecision(productId) {
  const url = productId ? [`${endpoints.decision}/${productId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      decision: data?.data,
      decisionLoading: isLoading,
      decisionError: error,
      decisionValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createDecision(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}

export async function updateDecision(id, data) {
  await axios.patch(`${ENDPOINT}/${id}`, data);
  mutate(`${ENDPOINT}`);
}

export async function archiveDecision(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.delete(`${ENDPOINT}/${id}`);
  // mutate(`${ENDPOINT}/${id}`);
}

export async function validateDecision(id, data, params) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/validate`, data);
  // mutate(`${ENDPOINT}`);
  mutate([ENDPOINT, { params }]);
}
