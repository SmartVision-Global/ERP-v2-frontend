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

const ENDPOINT = endpoints.purchaseSupply.purchaseOrder.list;
// Dynamic endpoint for fetching items of a BEB (eon-voucher)
const ENDPOINT_ITEMS = (id) => `${ENDPOINT}/${id}/items`;

// ----------------------------------------------------------------------

export function useGetPurchaseOrders(params) {
  // Use params to request paginated/filter data
  const key = params
    ? [ENDPOINT, { params }]
    : ENDPOINT;
  const { data, isLoading, error, isValidating } = useSWR(key, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      purchaseOrders: data?.data?.records || [],
      purchaseOrdersCount: data?.data?.total || 0,

      purchaseOrdersLoading: isLoading,
      purchaseOrdersError: error,
      purchaseOrdersValidating: isValidating,
      purchaseOrdersEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getFiltredPurchaseOrders(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetPurchaseOrder(id) {
  const url = id ? `${ENDPOINT}/${id}` : '';
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  
  const memoizedValue = useMemo(
    () => ({
      purchaseOrder: data?.data,
      purchaseOrderLoading: isLoading,
      purchaseOrderError: error,
      purchaseOrderValidating: isValidating,
      purchaseOrderEmpty: !isLoading && !isValidating && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

/**
 * Hook to fetch items for a given BEB (eon-voucher)
 * @param {string|number} id - ID of the eon-voucher
 * @param {{ limit: number, offset: number }} params - pagination parameters
 */
export function useGetPurchaseOrderItems(id, params) {
  const url = id ? ENDPOINT_ITEMS(id) : null;
  const swrKey = id ? [url, { params }] : null;
  
  const { data, isLoading, error, isValidating } = useSWR(swrKey, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      items: data?.data || [],
      itemsCount: data?.data?.total || 0,
      itemsLoading: isLoading,
      itemsError: error,
      itemsValidating: isValidating,
    }),
    [data?.data, data?.data?.total, error, isLoading, isValidating]
  );
  return memoizedValue;
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
