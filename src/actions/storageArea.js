import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const STORAGE_AREA_ENDPOINT = endpoints.stores.storageArea;
console.log('STORAGE_AREA_ENDPOINT', STORAGE_AREA_ENDPOINT);
// ----------------------------------------------------------------------

export function useGetStorageAreas(params) {
  const url = params ? [endpoints.storageArea, { params }] : endpoints.storageArea;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      storageAreas: data?.data?.records || [],
      storageAreasLoading: isLoading,
      storageAreasError: error,
      storageAreasValidating: isValidating,
      storageAreasEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetStorageArea(storageAreaId) {
  const url = storageAreaId ? [endpoints.storageArea.details, { params: { storageAreaId } }] : '';

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

export async function createStorageArea(data) {
  await axios.post(STORAGE_AREA_ENDPOINT, data);
}

export async function updateStorageArea(id, data) {
  await axios.put(`${STORAGE_AREA_ENDPOINT}/${id}`, data);
}

export async function deleteStorageArea(id) {
  await axios.delete(`${STORAGE_AREA_ENDPOINT}/${id}`);
}
