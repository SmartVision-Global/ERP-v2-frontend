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

const ENDPOINT = endpoints.overtime;

// ----------------------------------------------------------------------

export function useGetOvertimeList() {
  const url = endpoints.overtime;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      overtimeWorks: data?.data?.records || [],
      overtimeWorksLoading: isLoading,
      overtimeWorksError: error,
      overtimeWorksValidating: isValidating,
      overtimeWorksEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function uploadMedia(data) {
  // const url = productId ? [endpoints.product.details, { params: { productId } }] : '';
  //   const url = rateId ? [`${endpoints.overtime}/${rateId}`] : '';

  //   const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  const response = await axios.post('/v1/media', data);
  return response.data?.data;
}
