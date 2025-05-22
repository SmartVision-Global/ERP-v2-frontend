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

const ENDPOINT = endpoints.stores.list;

// ----------------------------------------------------------------------

export function useGetStocks(product_type) {
  // const url = endpoints.personal;
  const url = product_type ? [endpoints.stores.list, { product_type }] : endpoints.stores.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      stocks: data?.data?.records || [],
      stocksCount: data?.data?.total || 0,

      stocksLoading: isLoading,
      stocksError: error,
      stocksValidating: isValidating,
      stocksEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredStocks(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

// ----------------------------------------------------------------------

