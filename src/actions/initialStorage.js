import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const INITIAL_STORAGE_ENDPOINT = endpoints.stores.initialStorage;

// ----------------------------------------------------------------------

export function useGetInitialStorages() {
  const { data, isLoading, error, isValidating } = useSWR(
    INITIAL_STORAGE_ENDPOINT,
    fetcher,
    swrOptions
  );

  return useMemo(
    () => ({
      initialStorages: data?.data?.records || [],
      initialStoragesLoading: isLoading,
      initialStoragesError: error,
      initialStoragesValidating: isValidating,
      initialStoragesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );
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
}

export async function updateInitialStorage(id, data) {
  await axios.put(`${INITIAL_STORAGE_ENDPOINT}/${id}`, data);
}

export async function deleteInitialStorage(id) {
  await axios.delete(`${INITIAL_STORAGE_ENDPOINT}/${id}`);
}
