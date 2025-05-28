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
  const cleanParams = {
    ...(params?.only_parent !== undefined ? { only_parent: params.only_parent } : {}),
    ...(params?.parent !== undefined ? { parent: params.parent } : {}),
    ...(params?.store && { store: params.store }),
    ...(params?.code && { code: params.code }),
    ...(params?.designation && { designation: params.designation }),
    ...(params?.search && { search: params.search }),
  };

  console.log('Clean params:', cleanParams); // Add this log

  const url = [STORAGE_AREA_ENDPOINT, { params: cleanParams }];

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  console.log('Storage Areas Request:', {
    params: cleanParams,
    url,
    response: data,
  });

  return useMemo(
    () => ({
      storageAreas: data?.data?.records || [],
      storageAreasLoading: isLoading,
      storageAreasError: error,
      storageAreasValidating: isValidating,
      storageAreasEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );
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

export function useGetStorageAreaChildren(parentId) {
  const cleanParams = {
    only_parent: false,
    parent: parentId,
  };

  const url = parentId ? [STORAGE_AREA_ENDPOINT, { params: cleanParams }] : null;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  console.log('Storage Area Children Request:', {
    parentId,
    url,
    response: data,
  });

  return useMemo(
    () => ({
      children: data?.data?.records || [],
      childrenLoading: isLoading,
      childrenError: error,
      childrenValidating: isValidating,
      childrenEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );
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
