import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
};

const ENDPOINT = endpoints.site;

// ----------------------------------------------------------------------

export function useGetSites() {
  const url = endpoints.site;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      sites: data?.data?.records || [],
      sitesLoading: isLoading,
      sitesError: error,
      sitesValidating: isValidating,
      sitesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetSite(siteId) {
  const url = siteId ? [`${endpoints.site}/${siteId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      site: data?.data,
      siteLoading: isLoading,
      siteError: error,
      siteValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createSite(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  mutate(ENDPOINT);
}

export async function updateSite(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  mutate(ENDPOINT);
}
