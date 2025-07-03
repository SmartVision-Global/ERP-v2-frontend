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

const ENDPOINT = endpoints.settings.validationCircuits;


// ----------------------------------------------------------------------

export function useGetValidationCircuits(params) {
  // Use params to request paginated/filter data
  const key = params
    ? [ENDPOINT, { params }]
    : ENDPOINT;
  const { data, isLoading, error, isValidating } = useSWR(key, fetcher, swrOptions);
  
  const memoizedValue = useMemo(
    () => ({
      validationCircuits  : data?.data?.records || [],
      validationCircuitsCount: data?.data?.total || 0,
      validationCircuitsLoading: isLoading,
      validationCircuitsError: error,
      validationCircuitsValidating: isValidating,
      validationCircuitsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}



export function useGetValidationCircuit(target_action) {
  const url = target_action ? `${ENDPOINT}/${target_action}` : '';
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  
  const memoizedValue = useMemo(
    () => ({
      validationCircuit: data?.data,
      validationCircuitLoading: isLoading,
      validationCircuitError: error,
      validationCircuitValidating: isValidating,
      validationCircuitEmpty: !isLoading && !isValidating && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}



export function useGetBorrowingItems(id, params) {
  const url = id ? `${ENDPOINT}/${id}/items` : null;
  const swrKey = id ? [url, { params }] : null;
  
  const { data, isLoading, error, isValidating } = useSWR(swrKey, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      items: data?.data?.records || [],
      itemsCount: data?.data?.total || 0,
      itemsLoading: isLoading,
      itemsError: error,
      itemsValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}


/**
 * Generic function to create any entity type

 * @param {object} data - The data for the new entity
 */
export async function createEntity(data) {
  if (!enableServer) return;
  
  const endpoint = ENDPOINT;
  if (!endpoint) {
    console.error(`No endpoint found for entity type`);
    return;
  }
  
  try {
    await axios.post(endpoint, data);
    mutate(endpoints.stores.list);
  } catch (error) {
    console.error(`Error creating entity:`, error);
    throw error;
  }
}

/**
 * Generic function to update any entity type
 * @param {string} entityType - The type of entity to update
 * @param {number|string} id - The ID of the entity to update
 * @param {object} data - The updated data
 */
export async function updateEntity(id, data) {
  if (!enableServer) return;
  
  const endpoint = ENDPOINT;
  if (!endpoint) {
    console.error(`No endpoint found for entity type`);
    return;
  }
  
  try {
    await axios.patch(`${endpoint}/${id}`, data);
    mutate(endpoints.stores.list);
  } catch (error) {
    console.error(`Error updating entity:`, error);
    throw error;
  }
}

export async function confirmBorrowing(id, data) {
  if (!enableServer) return;
  const endpoint = `${ENDPOINT}/${id}/confirm`;
  try {
    await axios.post(endpoint, data);
    mutate(ENDPOINT);
  } catch (error) {
    console.error(`Error confirming borrowing:`, error);
    throw error;
  }
}

export async function cancelBorrowing(id, data) {
  if (!enableServer) return;
  const endpoint = `${ENDPOINT}/${id}/cancel`;
  try {
    await axios.post(endpoint, data);
    mutate(ENDPOINT);
  } catch (error) {
    console.error(`Error canceling borrowing:`, error);
    throw error;
  }
}

export async function fetchBorrowingsLookup(params) {
  try {
    const { data } = await axios.get('v1/inventory/lookups/borrowing', { params });
    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
}

