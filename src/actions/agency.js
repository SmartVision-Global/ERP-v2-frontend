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

const ENDPOINT = endpoints.agency;

// ----------------------------------------------------------------------

export function useGetAgencies() {
  const url = endpoints.agency;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      agencies: data?.data?.records || [],
      agenciesLoading: isLoading,
      agenciesError: error,
      agenciesValidating: isValidating,
      agenciesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAgency(agencyId) {
  // const url = productId ? [endpoints.product.details, { params: { productId } }] : '';
  const url = agencyId ? [`${endpoints.agency}/${agencyId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      agency: data?.data,
      agencyLoading: isLoading,
      agencyError: error,
      agencyValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createAgency(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}
export async function updateAgency(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  //   mutate(endpoints.site);
}
