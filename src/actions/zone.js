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

const ENDPOINT = endpoints.zone;

// ----------------------------------------------------------------------

export function useGetZones() {
  const url = endpoints.zone;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      zones: data?.data?.records || [],
      zonesLoading: isLoading,
      zonesError: error,
      zonesValidating: isValidating,
      zonesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetZone(productId) {
  const url = productId ? [endpoints.product.details, { params: { productId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createZone(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}
