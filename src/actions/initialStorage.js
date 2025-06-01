import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const INITIAL_STORAGE_ENDPOINT = endpoints.stores.initialStorage;

// ----------------------------------------------------------------------

export function useGetInitialStorages(params) {
  const url = params ? [INITIAL_STORAGE_ENDPOINT, { params }] : INITIAL_STORAGE_ENDPOINT;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      initialStorages: data?.data?.records || [],
      initialStoragesCount: data?.data?.total || 0,
      initialStoragesLoading: isLoading,
      initialStoragesError: error,
      initialStoragesValidating: isValidating,
      initialStoragesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// New function for filtered data
export async function getFiltredInitialStorages(params) {
  const response = await axios.get(INITIAL_STORAGE_ENDPOINT, {
    params,
  });
  return response;
}

export function useGetInitialStorage(id) {
  const { data, isLoading, error } = useSWR(
    id ? `${INITIAL_STORAGE_ENDPOINT}/${id}` : null,
    fetcher,
    swrOptions
  );

  return {
    initialStorage: data?.data || null,
    initialStorageLoading: isLoading,
    initialStorageError: error,
  };
}

export async function createInitialStorage(data) {
  await axios.post(INITIAL_STORAGE_ENDPOINT, data);
  mutate(INITIAL_STORAGE_ENDPOINT);
}

export const updateInitialStorage = async (id, data) => {
  await axios.put(`${INITIAL_STORAGE_ENDPOINT}/${id}`, data);
  mutate(INITIAL_STORAGE_ENDPOINT);
};

export async function deleteInitialStorage(id) {
  await axios.delete(`${INITIAL_STORAGE_ENDPOINT}/${id}`);
}
