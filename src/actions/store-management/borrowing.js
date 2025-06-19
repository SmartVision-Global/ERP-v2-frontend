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

const ENDPOINT = endpoints.stores.borrowing;


// ----------------------------------------------------------------------

export function useGetBorrowings(params) {
  // Use params to request paginated/filter data
  const key = params
    ? [ENDPOINT, { params }]
    : ENDPOINT;
  const { data, isLoading, error, isValidating } = useSWR(key, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      borrowings  : data?.data?.records || [],
      borrowingsCount: data?.data?.total || 0,
      borrowingsLoading: isLoading,
      borrowingsError: error,
      borrowingsValidating: isValidating,
      borrowingsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredBorrowings(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetBorrowing(id) {
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

export function useGetBorrowingProducts(id) {
  const url = id ? `${ENDPOINT}/${id}/products` : '';
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  return {
    borrowingProducts: data?.data,
    borrowingProductsLoading: isLoading,
    borrowingProductsError: error,
    borrowingProductsValidating: isValidating,
    borrowingProductsEmpty: !isLoading && !isValidating && !data?.data,
  };
}


/**
 * Generic function to create any entity type

 * @param {object} data - The data for the new entity
 */
export async function createEntity(data) {
  if (!enableServer) return;
  
  const endpoint = ENDPOINT;
  if (!endpoint) {
    console.error(`No endpoint found for entity type`);
    return;
  }
  console.log('createEntity data', data);
  try {
    await axios.post(endpoint, data);
    mutate(endpoints.stores.list);
  } catch (error) {
    console.error(`Error creating entity:`, error);
    throw error;
  }
}

/**
 * Generic function to update any entity type
 * @param {string} entityType - The type of entity to update
 * @param {number|string} id - The ID of the entity to update
 * @param {object} data - The updated data
 */
export async function updateEntity(id, data) {
  if (!enableServer) return;
  
  const endpoint = ENDPOINT;
  if (!endpoint) {
    console.error(`No endpoint found for entity type`);
    return;
  }
  
  try {
    await axios.patch(`${endpoint}/${id}`, data);
    mutate(endpoints.stores.list);
  } catch (error) {
    console.error(`Error updating entity:`, error);
    throw error;
  }
}
