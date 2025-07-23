import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = true;
// settings - identification - global settings
const CHARGE_TYPE_ENDPOINT = endpoints.purchaseSupply.settings.chargeTypes.list;

const swrOptions = {
  revalidateIfStale: enableServer || false,
  revalidateOnFocus: enableServer || false,
  revalidateOnReconnect: enableServer || false,
};

// Generic functions for creating and updating entities
// ----------------------------------------------------------------------

// Map parameter keys to their endpoint constants
const ENDPOINT_MAP = {
  'charge_types': CHARGE_TYPE_ENDPOINT,
};

/**
 * Generic function to create any entity type
 * @param {string} entityType - The type of entity to create
 * @param {object} data - The data for the new entity
 */
export async function createEntity(entityType, data) {
  if (!enableServer) return;
  
  const endpoint = ENDPOINT_MAP[entityType];
  if (!endpoint) {
    console.error(`No endpoint found for entity type: ${entityType}`);
    return;
  }
  
  try {
    await axios.post(endpoint, data);
    mutate(endpoints.purchaseSupply.settings.chargeTypes.list);
  } catch (error) {
    console.error(`Error creating ${entityType}:`, error);
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
  
  const endpoint = ENDPOINT_MAP[entityType];
  if (!endpoint) {
    console.error(`No endpoint found for entity type: ${entityType}`);
    return;
  }
  
  try {
    await axios.patch(`${endpoint}/${id}`, data);
    mutate(endpoints.purchaseSupply.settings.chargeTypes.list);
  } catch (error) {
    console.error(`Error updating ${entityType}:`, error);
  }
}


// ----------------------------------------------------------------------

// export function useGetIdentificationEntities() {
  
//   const url = endpoints.settings.identification.globalSettings.list;

//   const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

//   const memoizedValue = useMemo(
//     () => ({
//       entities: data?.data || [],
//       entitiesLoading: isLoading,
//       entitiesError: error,
//       entitiesValidating: isValidating,
//       entitiesEmpty: !isLoading && !isValidating && !data?.data.length,
//     }),
//     [data?.data, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

export const useGetChargeTypes = () => {
    const url = endpoints.purchaseSupply.settings.chargeTypes.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      chargeTypes: data?.data?.records || [],
      chargeTypesCount: data?.data?.total || 0,
      chargeTypesLoading: isLoading,
      chargeTypesError: error,
      chargeTypesValidating: isValidating,
      chargeTypesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}



// // ----------------------------------------------------------------------
// export function useGetIdentificationEntity(productId) {
//   const url = productId ? [endpoints.product.details, { params: { productId } }] : '';

//   const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

//   const memoizedValue = useMemo(
//     () => ({
//       product: data?.product,
//       productLoading: isLoading,
//       productError: error,
//       productValidating: isValidating,
//     }),
//     [data?.product, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }



// ----------------------------------------------------------------------
