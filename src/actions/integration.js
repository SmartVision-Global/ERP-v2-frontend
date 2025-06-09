import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const INTEGRATION_ENDPOINT = endpoints.stores.integrations;

// ----------------------------------------------------------------------

export function useGetIntegrations(params, refreshTrigger = 0) {
  const url = params
    ? [INTEGRATION_ENDPOINT, { params, refreshTrigger }]
    : [INTEGRATION_ENDPOINT, { refreshTrigger }];

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      integrations: data?.data?.records || [],
      integrationsCount: data?.data?.total || 0,
      integrationsLoading: isLoading,
      integrationsError: error,
      integrationsValidating: isValidating,
      integrationsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredIntegrations(params) {
  const response = await axios.get(INTEGRATION_ENDPOINT, {
    params,
  });
  return response;
}

export function useGetIntegration(id) {
  const { data, isLoading, error } = useSWR(
    id ? `${INTEGRATION_ENDPOINT}/${id}` : null,
    fetcher,
    swrOptions
  );
  mutate(INTEGRATION_ENDPOINT);
  return {
    integration: data?.data || null,
    integrationLoading: isLoading,
    integrationError: error,
  };
}

export async function createIntegration(data) {
  const response = await axios.post(INTEGRATION_ENDPOINT, data);
  await mutate(
    (key) => typeof key === 'string' && key.startsWith(INTEGRATION_ENDPOINT),
    undefined,
    {
      revalidate: true,
    }
  );
  return response;
}

export const updateIntegration = async (id, data) => {
  const response = await axios.put(`${INTEGRATION_ENDPOINT}/${id}`, data);
  await mutate(
    (key) => typeof key === 'string' && key.startsWith(INTEGRATION_ENDPOINT),
    undefined,
    {
      revalidate: true,
    }
  );
  return response;
};

export async function getIntegrationItems(id) {
  const response = await axios.get(`${INTEGRATION_ENDPOINT}/${id}/items`);
  return response;
}
