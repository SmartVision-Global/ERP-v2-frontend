import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = true;

const swrOptions = {
  revalidateIfStale: enableServer || false,
  revalidateOnFocus: enableServer || false,
  revalidateOnReconnect: enableServer || false,
};

const ENDPOINT = endpoints.stores.third;


// ----------------------------------------------------------------------

export function useGetThirds(params) {
  // Use params to request paginated/filter data
  const key = params
    ? [ENDPOINT, { params }]
    : ENDPOINT;
  const { data, isLoading, error, isValidating } = useSWR(key, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      thirds  : data?.data?.records || [],
      thirdsCount: data?.data?.total || 0,
      thirdsLoading: isLoading,
      thirdsError: error,
      thirdsValidating: isValidating,
      thirdsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredThirds(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetThird(id) {
  const url = id ? `${ENDPOINT}/${id}` : '';
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      third: data?.data,
      thirdLoading: isLoading,
      thirdError: error,
      thirdValidating: isValidating,
      thirdEmpty: !isLoading && !isValidating && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

