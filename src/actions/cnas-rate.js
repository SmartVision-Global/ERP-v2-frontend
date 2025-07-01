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

const ENDPOINT = endpoints.rates;

// ----------------------------------------------------------------------

export function useGetRates() {
  const url = endpoints.rates;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      rates: data?.data?.records || [],
      ratesLoading: isLoading,
      ratesError: error,
      ratesValidating: isValidating,
      ratesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetRate(rateId) {
  // const url = productId ? [endpoints.product.details, { params: { productId } }] : '';
  const url = rateId ? [`${endpoints.rates}/${rateId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      rate: data?.data,
      rateLoading: isLoading,
      rateError: error,
      rateValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createRate(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}

export async function updateRate(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  //   mutate(endpoints.site);
}
