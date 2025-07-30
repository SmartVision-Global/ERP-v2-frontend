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

const ENDPOINT = endpoints.purchaseSupply.purchaseRequest.list;
// Dynamic endpoint for fetching items of a BEB (eon-voucher)
const ENDPOINT_ITEMS = (id) => `${ENDPOINT}/${id}/items`;
const ENDPOINT_ALL_ITEMS = () => `${ENDPOINT}/items`;
const ENDPOINT_CONFIRM = (id) => `${ENDPOINT}/${id}/confirme`;
const ENDPOINT_CANCEL = (id) => `${ENDPOINT}/${id}/cancele`;

// ----------------------------------------------------------------------

export function useGetPurchaseRequests(params) {
  // Use params to request paginated/filter data
  const key = params
    ? [ENDPOINT, { params }]
    : ENDPOINT;
  const { data, isLoading, error, isValidating } = useSWR(key, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      purchaseRequests: data?.data?.records || [],
      purchaseRequestsCount: data?.data?.total || 0,
      purchaseRequestsLoading: isLoading,
      purchaseRequestsError: error,
      purchaseRequestsValidating: isValidating,
      purchaseRequestsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredPurchaseRequests(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}



export function useGetPurchaseRequest(id) {
  const url = id ? `${ENDPOINT}/${id}` : '';
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  
  const memoizedValue = useMemo(
    () => ({
      purchaseRequest: data?.data,
      purchaseRequestLoading: isLoading,
      purchaseRequestError: error,
      purchaseRequestValidating: isValidating,
      purchaseRequestEmpty: !isLoading && !isValidating && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

/**
 * Hook to fetch items for a given purchase request 
 * @param {string|number} id - ID of the purchase request
 * @param {{ limit: number, offset: number }} params - pagination parameters
 */
export function useGetPurchaseRequestItems(id, params) {
  const url = id ? ENDPOINT_ITEMS(id) : null;
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
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );
  return memoizedValue;
}


// GET ALL ITEMS of all purchase requests
export function useGetAllPurchaseRequestsItems(params) {
  const key = params
    ? [ENDPOINT_ALL_ITEMS(), { params }]
    : ENDPOINT_ALL_ITEMS();

  console.log('key', key);
  
  const { data, isLoading, error, isValidating } = useSWR(key, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      items: data?.data?.records || [],
      itemsCount: data?.data?.total || 0,
      itemsLoading: isLoading,
      itemsError: error,
      itemsValidating: isValidating,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export async function getFiltredPurchaseRequestItems(id, params) {
  const url = id ? ENDPOINT_ITEMS(id) : null;
  const response = await axios.get(url, {
    params,
  });
  return response;
}

export async function getFiltredAllPurchaseRequestsItems(params) {
  const response = await axios.get(ENDPOINT_ALL_ITEMS(), {
    params,
  });
  return response;
}

// ----------------------------------------------------------------------

/**
 * Generic function to create any entity type
 * @param {string} entityType - The type of entity to create
 * @param {object} data - The data for the new entity
 */
export async function createEntity(entityType, data) {
  if (!enableServer) return;
  
  const endpoint = ENDPOINT;
  if (!endpoint) {
    console.error(`No endpoint found for entity type: ${entityType}`);
    return;
  }
  
  try {
    await axios.post(endpoint, data);
    mutate(ENDPOINT);
  } catch (error) {
    console.error(`Error creating ${entityType}:`, error);
    throw error;
  }
}

/**
 * Generic function to update any entity type
 * @param {string} entityType - The type of entity to update
 * @param {number|string} id - The ID of the entity to update
 * @param {object} data - The updated data
 */
export async function updateEntity(entityType, id, data) {
  if (!enableServer) return;
  
  const endpoint = ENDPOINT;
  if (!endpoint) {
    console.error(`No endpoint found for entity type: ${entityType}`);
    return;
  }
  
  try {
    await axios.patch(`${endpoint}/${id}`, data);
    mutate(ENDPOINT);
  } catch (error) {
    console.error(`Error updating ${entityType}:`, error);
    throw error;
  }
}


export async function confirmPurchaseRequest(id, data) { 
  const endpoint = ENDPOINT_CONFIRM(id);
  await axios.post(endpoint, data);
  mutate(ENDPOINT);
}

export async function cancelPurchaseRequest(id, data) { 
  const endpoint = ENDPOINT_CANCEL(id);
  await axios.post(endpoint, data);
  mutate(ENDPOINT);
}


