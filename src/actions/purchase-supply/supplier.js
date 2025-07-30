import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = true;

const swrOptions = {
  revalidateIfStale: enableServer || false,
  revalidateOnFocus: enableServer || false,
  revalidateOnReconnect: enableServer || false,
};

const ENDPOINT = endpoints.purchaseSupply.supplier.list;

// ----------------------------------------------------------------------

export function useGetSuppliers(params) {
  const key = params ? [ENDPOINT, { params }] : ENDPOINT;
  const { data, isLoading, error, isValidating } = useSWR(key, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      suppliers: data?.data?.records || [],
      suppliersCount: data?.data?.total || 0,
      suppliersLoading: isLoading,
      suppliersError: error,
      suppliersValidating: isValidating,
      suppliersEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredSuppliers(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetSupplier(id) {
  const url = id ? `${ENDPOINT}/${id}` : '';
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      supplier: data?.data,
      supplierLoading: isLoading,
      supplierError: error,
      supplierValidating: isValidating,
      supplierEmpty: !isLoading && !isValidating && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createSupplier(data) {
  if (!enableServer) return;

  const endpoint = ENDPOINT;
  if (!endpoint) {
    console.error(`No endpoint found for supplier`);
    return;
  }

  try {
    await axios.post(endpoint, data);
    mutate(ENDPOINT);
  } catch (error) {
    console.error(`Error creating supplier:`, error);
    throw error;
  }
}

export async function updateSupplier(id, data) {
  if (!enableServer) return;

  const endpoint = ENDPOINT;
  if (!endpoint) {
    console.error(`No endpoint found for supplier`);
    return;
  }

  try {
    await axios.patch(`${endpoint}/${id}`, data);
    mutate(ENDPOINT);
  } catch (error) {
    console.error(`Error updating supplier:`, error);
    throw error;
  }
} 