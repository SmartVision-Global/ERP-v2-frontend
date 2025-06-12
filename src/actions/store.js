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

const STORE_ENDPOINT = endpoints.store;

// ----------------------------------------------------------------------

export function useGetStores(params) {
  const url = params ? [endpoints.store, { params }] : endpoints.store;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      stores: data?.data?.records || [],
      storesLoading: isLoading,
      storesError: error,
      storesValidating: isValidating,
      storesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetStore(storeId) {
  const url = storeId ? [endpoints.store.details, { params: { storeId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      item: data?.item,
      itemLoading: isLoading,
      itemError: error,
      itemValidating: isValidating,
    }),
    [data?.item, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export async function createStore(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(STORE_ENDPOINT, data);
  //   mutate(endpoints.store);
}
