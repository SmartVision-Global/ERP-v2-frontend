import useSWR from 'swr';
import { useMemo } from 'react';

// import { fetcher, endpoints } from 'src/lib/axios';
import { fetcher } from 'src/lib/axios';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useMultiLookups(entities = []) {
  console.log('multi lookups', entities);
  const results = entities.map((entity) => ({
    key: entity.entity,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ...useGetLookups(entity.url, entity.params),
  }));
  const dataLookups = Object.fromEntries(results.map(({ key, data }) => [key, data]));

  const dataLoading = results.some((res) => res.dataLoading);
  const dataError = results.find((res) => res.dataError);
  const dataValidating = results.some((res) => res.dataValidating);

  return {
    dataLookups,
    dataLoading,
    dataError,
    dataValidating,
  };
}

export function useGetLookups(subUrl, params) {
  const url = params ? [`/v1/${subUrl}`, { params }] : `/v1/${subUrl}`;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      data: data?.data?.records || [],
      dataLoading: isLoading,
      dataError: error,
      dataValidating: isValidating,
      dataEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}
