import useSWR from 'swr';
import { useMemo } from 'react';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

const ENDPOINT = endpoints.deductionsCompensations;

// ----------------------------------------------------------------------

export function useGetDeductionsCompensations() {
  const url = endpoints.deductionsCompensations;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      deductionsCompensations: data?.data?.records || [],
      deductionsCompensationsLoading: isLoading,
      deductionsCompensationsError: error,
      deductionsCompensationsValidating: isValidating,
      deductionsCompensationsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDeductionsCompensationsByContributoryImposable(contributory_imposable) {
  // const url = endpoints.deductionsCompensations;
  const url = contributory_imposable
    ? [endpoints.deductionsCompensations, { params: { contributory_imposable } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      deductionsCompensations: data?.data?.records || [],
      deductionsCompensationsLoading: isLoading,
      deductionsCompensationsError: error,
      deductionsCompensationsValidating: isValidating,
      deductionsCompensationsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetDeductionCompensation(deductionCompensationId) {
  const url = deductionCompensationId
    ? [`${endpoints.deductionsCompensations}/${deductionCompensationId}`]
    : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      deductionCompensation: data?.data,
      deductionCompensationLoading: isLoading,
      deductionCompensationError: error,
      deductionCompensationValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createDeductionsCompensations(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}

export async function updateDeductionsCompensations(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  //   mutate(endpoints.site);
}
