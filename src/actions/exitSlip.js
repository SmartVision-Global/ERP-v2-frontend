import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const EXIT_SLIP_ENDPOINT = endpoints.stores.exitSlip;

// ----------------------------------------------------------------------

export function useGetExitSlips(params) {
  const url = params ? [EXIT_SLIP_ENDPOINT, { params }] : EXIT_SLIP_ENDPOINT;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      exitSlips: data?.data?.records || [],
      exitSlipsCount: data?.data?.total || 0,
      exitSlipsLoading: isLoading,
      exitSlipsError: error,
      exitSlipsValidating: isValidating,
      exitSlipsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// New function for filtered data
export async function getFiltredExitSlips(params) {
  const response = await axios.get(EXIT_SLIP_ENDPOINT, {
    params,
  });
  return response;
}

export function useGetExitSlip(id) {
  const { data, isLoading, error } = useSWR(
    id ? `${EXIT_SLIP_ENDPOINT}/${id}` : null,
    fetcher,
    swrOptions
  );
  mutate(EXIT_SLIP_ENDPOINT);
  return {
    exitSlip: data?.data || null,
    exitSlipLoading: isLoading,
    exitSlipError: error,
  };
}

export async function createExitSlip(data) {
  const response = await axios.post(EXIT_SLIP_ENDPOINT, data);
  // Mutate all exit slip queries to ensure the list is updated
  await mutate((key) => typeof key === 'string' && key.startsWith(EXIT_SLIP_ENDPOINT), undefined, {
    revalidate: true,
  });
  return response;
}

export const updateExitSlip = async (id, data) => {
  const response = await axios.put(`${EXIT_SLIP_ENDPOINT}/${id}`, data);
  // Mutate all exit slip queries to ensure the list is updated
  await mutate((key) => typeof key === 'string' && key.startsWith(EXIT_SLIP_ENDPOINT), undefined, {
    revalidate: true,
  });
  return response;
};

export async function deleteExitSlip(id) {
  const response = await axios.delete(`${EXIT_SLIP_ENDPOINT}/${id}`);
  // Mutate all exit slip queries to ensure the list is updated
  await mutate((key) => typeof key === 'string' && key.startsWith(EXIT_SLIP_ENDPOINT), undefined, {
    revalidate: true,
  });
  return response;
}
