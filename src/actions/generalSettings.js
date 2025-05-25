import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const GENERAL_SETTINGS_ENDPOINT = endpoints.generalSettings;

// ----------------------------------------------------------------------

export function useGetGeneralSettings(params) {
  const url = params ? [GENERAL_SETTINGS_ENDPOINT, { params }] : GENERAL_SETTINGS_ENDPOINT;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      generalSettings: data?.data?.records || [],
      generalSettingsLoading: isLoading,
      generalSettingsError: error,
      generalSettingsValidating: isValidating,
      generalSettingsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetGeneralSetting(settingId) {
  const url = settingId ? [endpoints.generalSettings.details, { params: { settingId } }] : '';

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

export async function createGeneralSetting(data) {
  /**
   * Work on server
   */
  await axios.patch(GENERAL_SETTINGS_ENDPOINT, data);
  // Optionally, you can trigger a revalidation of the SWR cache:
  // mutate(endpoints.generalSettings);
}
