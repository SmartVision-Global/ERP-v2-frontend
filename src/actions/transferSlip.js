import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const TRANSFER_SLIP_ENDPOINT = endpoints.stores.transferSlips;

// ----------------------------------------------------------------------

export function useGetTransferSlips(params, refreshTrigger = 0) {
  const url = params
    ? [TRANSFER_SLIP_ENDPOINT, { params, refreshTrigger }]
    : [TRANSFER_SLIP_ENDPOINT, { refreshTrigger }];

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      transferSlips: data?.data?.records || [],
      transferSlipsCount: data?.data?.total || 0,
      transferSlipsLoading: isLoading,
      transferSlipsError: error,
      transferSlipsValidating: isValidating,
      transferSlipsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredTransferSlips(params) {
  const response = await axios.get(TRANSFER_SLIP_ENDPOINT, {
    params,
  });
  return response;
}

export function useGetTransferSlip(id) {
  const { data, isLoading, error } = useSWR(
    id ? `${TRANSFER_SLIP_ENDPOINT}/${id}` : null,
    fetcher,
    swrOptions
  );
  mutate(TRANSFER_SLIP_ENDPOINT);
  return {
    transferSlip: data?.data || null,
    transferSlipLoading: isLoading,
    transferSlipError: error,
  };
}

export async function createTransferSlip(data) {
  const response = await axios.post(TRANSFER_SLIP_ENDPOINT, data);
  return response;
}

export const updateTransferSlip = async (id, data) => {
  const response = await axios.put(`${TRANSFER_SLIP_ENDPOINT}/${id}`, data);
  await mutate(
    (key) => typeof key === 'string' && key.startsWith(TRANSFER_SLIP_ENDPOINT),
    undefined,
    {
      revalidate: true,
    }
  );
  return response;
};

export async function getTransferSlipItems(id) {
  const response = await axios.get(`${TRANSFER_SLIP_ENDPOINT}/${id}`);
  return response;
}
