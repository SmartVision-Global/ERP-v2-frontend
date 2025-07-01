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

const ENDPOINT = endpoints.leaveAbesence;

// ----------------------------------------------------------------------

export function useGetLeavesAbesences(params) {
  const url = params ? [endpoints.leaveAbesence, { params }] : endpoints.leaveAbesence;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      leavesAbesences: data?.data?.records || [],
      leavesAbesencesCount: data?.data?.total || 0,

      leavesAbesencesLoading: isLoading,
      leavesAbesencesError: error,
      leavesAbesencesValidating: isValidating,
      leavesAbesencesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function getFiltredLeavesAbesences(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetLeaveAbesence(rateId) {
  // const url = productId ? [endpoints.product.details, { params: { productId } }] : '';
  const url = rateId ? [`${endpoints.leaveAbesence}/${rateId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      leaveAbesence: data?.data,
      leaveAbesenceLoading: isLoading,
      leaveAbesenceError: error,
      leaveAbesenceValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createLeaveAbesence(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}

export async function updateLeaveAbesence(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  //   mutate(endpoints.site);
}

export async function validateLeaveAbesence(id, data, params) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/validate`, data);
  // mutate(ENDPOINT);
  mutate([ENDPOINT, { params }]);
}

export async function archiveLeaveAbesence(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/archive`, data);
  //   mutate(endpoints.site);
  mutate(ENDPOINT);
}

export async function cancelLeaveAbesence(id, data, params) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/cancel`, data);
  mutate([ENDPOINT, { params }]);

  //   mutate(endpoints.site);
}
