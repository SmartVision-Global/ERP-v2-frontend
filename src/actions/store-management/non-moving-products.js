import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = true;

const swrOptions = {
  revalidateIfStale: enableServer || false,
  revalidateOnFocus: enableServer || false,
  revalidateOnReconnect: enableServer || false,
};

const ENDPOINT = endpoints.stores.nonMovingProducts;


// ----------------------------------------------------------------------

export function useGetNonMovingProducts(params) {
  // Use params to request paginated/filter data
  const key = params
    ? [ENDPOINT, { params }]
    : ENDPOINT;
  const { data, isLoading, error, isValidating } = useSWR(key, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      nonMovingProducts  : data?.data?.records || [],
      nonMovingProductsCount: data?.data?.total || 0,
      nonMovingProductsLoading: isLoading,
      nonMovingProductsError: error,
      nonMovingProductsValidating: isValidating,
      nonMovingProductsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredNonMovingProducts(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetNonMovingProduct(id) {
  const url = id ? `${ENDPOINT}/${id}` : '';
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      borrowing: data?.data,
      borrowingLoading: isLoading,
      borrowingError: error,
      borrowingValidating: isValidating,
      borrowingEmpty: !isLoading && !isValidating && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}



export function useGetNonMovingProductItems(id, params) {
  const url = id ? `${ENDPOINT}/${id}/items` : null;
  const swrKey = id ? [url, { params }] : null;
  
  const { data, isLoading, error, isValidating } = useSWR(swrKey, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      items: data?.data?.records || [],
      itemsCount: data?.data?.total || 0,
      itemsLoading: isLoading,
      itemsError: error,
      itemsValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}


export async function fetchNonMovingProductsLookup(params) {
  try {
    const { data } = await axios.get('v1/inventory/lookups/non-moving-products', { params });
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
}


