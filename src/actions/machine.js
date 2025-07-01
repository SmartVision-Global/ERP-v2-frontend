import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
};

const ENDPOINT = endpoints.machine;

// ----------------------------------------------------------------------

export function useGetMachines() {
  const url = endpoints.machine;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      machines: data?.data?.records || [],
      machinesLoading: isLoading,
      machinesError: error,
      machinesValidating: isValidating,
      machinesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetMachine(machineId) {
  const url = machineId ? [`${endpoints.machine}/${machineId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      machine: data?.data,
      machineLoading: isLoading,
      machineError: error,
      machineValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createMachine(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  mutate(ENDPOINT);
}

export async function updateMachine(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  mutate(ENDPOINT);
}
