import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';
// Define the endpoint for user global settings
const USER_GLOBAL_SETTINGS_ENDPOINT = endpoints.generalSettings;

// SWR options
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// Function to fetch user global settings using SWR
export function useGetUserGlobalSettings(params) {
  const url = params ? [USER_GLOBAL_SETTINGS_ENDPOINT, { params }] : USER_GLOBAL_SETTINGS_ENDPOINT;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      userGlobalSettings: data?.data?.records || [],
      userGlobalSettingsLoading: isLoading,
      userGlobalSettingsError: error,
      userGlobalSettingsValidating: isValidating,
      userGlobalSettingsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// Optional: Function to fetch a specific user's global settings by ID using SWR
export function useGetUserGlobalSetting(userId) {
  const url = userId ? [USER_GLOBAL_SETTINGS_ENDPOINT, { params: { userId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      userGlobalSetting: data?.item,
      userGlobalSettingLoading: isLoading,
      userGlobalSettingError: error,
      userGlobalSettingValidating: isValidating,
    }),
    [data?.item, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// Function to fetch user global settings directly using axios
export async function fetchUserGlobalSettings(params) {
  try {
    const response = await axios.get(USER_GLOBAL_SETTINGS_ENDPOINT, { params });
    return response.data.records; // Return the fetched records
  } catch (error) {
    console.error('Error fetching user global settings:', error);
    throw error; // Re-throw the error for further handling
  }
}
