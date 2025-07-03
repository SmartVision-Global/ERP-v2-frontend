import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

const enableServer = true;

const swrOptions = {
  revalidateIfStale: enableServer || false,
  revalidateOnFocus: enableServer || false,
  revalidateOnReconnect: enableServer || false,
};

const ENDPOINT = endpoints.stores.borrowingReturns;

export function useGetBorrowingReturns(params) {
  const key = params ? [ENDPOINT, { params }] : ENDPOINT;
  const { data, isLoading, error, isValidating } = useSWR(key, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      borrowingReturns: data?.data?.records || [],
      borrowingReturnsCount: data?.data?.total || 0,
      borrowingReturnsLoading: isLoading,
      borrowingReturnsError: error,
      borrowingReturnsValidating: isValidating,
      borrowingReturnsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredBorrowingReturns(params) {
  const response = await axios.get(ENDPOINT, { params });
  return response;
}

export function useGetBorrowingReturn(id) {
  const url = id ? `${ENDPOINT}/${id}` : '';
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      borrowingReturn: data?.data,
      borrowingReturnLoading: isLoading,
      borrowingReturnError: error,
      borrowingReturnValidating: isValidating,
      borrowingReturnEmpty: !isLoading && !isValidating && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetBorrowingReturnItems(id, params) {
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
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export async function createBorrowingReturn(data) {
  if (!enableServer) return;

  try {
    await axios.post(ENDPOINT, data);
    mutate(ENDPOINT);
  } catch (error) {
    console.error(`Error creating entity:`, error);
    throw error;
  }
}

export async function updateBorrowingReturn(id, data) {
  if (!enableServer) return;

  try {
    await axios.patch(`${ENDPOINT}/${id}`, data);
    mutate(ENDPOINT);
  } catch (error) {
    console.error(`Error updating entity:`, error);
    throw error;
  }
}

export async function confirmBorrowingReturn(id, data) {
  if (!enableServer) return;
  const endpoint = `${ENDPOINT}/${id}/confirm`;
  try {
    await axios.post(endpoint, data);
    mutate(ENDPOINT);
  } catch (error) {
    console.error(`Error confirming borrowing return:`, error);
    throw error;
  }
}

export async function cancelBorrowingReturn(id, data) {
  if (!enableServer) return;
  const endpoint = `${ENDPOINT}/${id}/cancel`;
  try {
    await axios.post(endpoint, data);
    mutate(ENDPOINT);
  } catch (error) {
    console.error(`Error canceling borrowing return:`, error);
    throw error;
  }
} 