import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const GENERAL_SETTINGS_INFO_ENDPOINT = endpoints.generalSettingsDetails;

// ----------------------------------------------------------------------

export function useGetGeneralSettingsInfo(params) {
  const url = params
    ? [GENERAL_SETTINGS_INFO_ENDPOINT, { params }]
    : GENERAL_SETTINGS_INFO_ENDPOINT;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      generalSettingsInfo: data?.data?.records || [],
      generalSettingsInfoLoading: isLoading,
      generalSettingsInfoError: error,
      generalSettingsInfoValidating: isValidating,
      generalSettingsInfoEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetGeneralSettingsInfoItem(infoId) {
  const url = infoId ? [endpoints.generalSettingsDetails, { params: { infoId } }] : '';

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

// ----------------------------------------------------------------------

export async function createGeneralSettingsInfo(data) {
  /**
   * Work on server
   */
  await axios.post(GENERAL_SETTINGS_INFO_ENDPOINT, data);
  // Optionally, you can trigger a revalidation of the SWR cache:
  // mutate(endpoints.generalSettingsInfo);
}
