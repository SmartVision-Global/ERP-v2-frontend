import useSWR from 'swr';
import { useMemo } from 'react';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
};

const ENDPOINT = endpoints.das;

export function useGetDas(params) {
  const url = params ? [endpoints.das, { params }] : endpoints.das;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      das: data?.data?.records || [],
      dasCount: data?.data?.total || 0,
      dasLoading: isLoading,
      dasError: error,
      dasValidating: isValidating,
      dasEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDasDetails(params) {
  const url = params ? [endpoints.dasDetails, { params }] : endpoints.dasDetails;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      dasDetails: data?.data?.records || [],
      dasDetailsCount: data?.data?.total || 0,
      dasDetailsLoading: isLoading,
      dasDetailsError: error,
      dasDetailsValidating: isValidating,
      dasDetailsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredDas(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export async function getFiltredDasDetails(params) {
  const response = await axios.get(`${endpoints.dasDetails}`, {
    params,
  });
  return response;
}

export async function getDocumentsDasDetails(params) {
  const response = await axios.get(`${endpoints.dasDetailsDownload}`, {
    params,
    responseType: 'blob',
  });
  return response;
}
