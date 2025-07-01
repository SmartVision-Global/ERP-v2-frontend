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

const ENDPOINT = endpoints.recovery;

// ----------------------------------------------------------------------

export function useGetRecoveries(params) {
  const url = params ? [endpoints.recovery, { params }] : endpoints.recovery;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      recoveries: data?.data?.records || [],
      recoveriesCount: data?.data?.total || 0,

      recoveriesLoading: isLoading,
      recoveriesError: error,
      recoveriesValidating: isValidating,
      recoveriesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function getFiltredRecoveries(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetRecovery(rateId) {
  // const url = productId ? [endpoints.product.details, { params: { productId } }] : '';
  const url = rateId ? [`${endpoints.recovery}/${rateId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      recovery: data?.data,
      recoveryLoading: isLoading,
      recoveryError: error,
      recoveryValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createRecovery(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}

export async function updateRecovery(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  //   mutate(endpoints.site);
}

export async function validateRecovery(id, data, params) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/validate`, data);
  mutate([ENDPOINT, { params }]);
}

export async function archiveRecovery(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/archive`, data);
  //   mutate(endpoints.site);
  mutate(ENDPOINT);
}

export async function cancelRecovery(id, data, params) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/cancel`, data);
  mutate([ENDPOINT, { params }]);

  //   mutate(endpoints.site);
}
