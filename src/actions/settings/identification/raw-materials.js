import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = true;
// settings - identification - raw materials

const CATEGORY_ENDPOINT = endpoints.settings.identification.categories.list;
const RETURN_PATTERN_ENDPOINT = endpoints.settings.identification.returnPatterns.list;
const FAMILY_ENDPOINT = endpoints.settings.identification.families.list;


const swrOptions = {
  revalidateIfStale: enableServer || false,
  revalidateOnFocus: enableServer || false,
  revalidateOnReconnect: enableServer || false,
};

// Generic functions for creating and updating entities
// ----------------------------------------------------------------------

// Map parameter keys to their endpoint constants
const ENDPOINT_MAP = {
  'categories': CATEGORY_ENDPOINT,
  'returnPatterns': RETURN_PATTERN_ENDPOINT,
  'families': FAMILY_ENDPOINT,
};

/**
 * Generic function to create any entity type
 * @param {string} entityType - The type of entity to create
 * @param {object} data - The data for the new entity
 */
export async function createEntity(entityType, data, group, nature) {
  if (!enableServer) return;
  
  const endpoint = ENDPOINT_MAP[entityType];
  if (!endpoint) {
    console.error(`No endpoint found for entity type: ${entityType}`);
    return;
  }
  
  try {
    await axios.post(endpoint, data);
    mutate([CATEGORY_ENDPOINT, { params: { group } }]);
    mutate([RETURN_PATTERN_ENDPOINT, { params: { group, nature } }]);
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
export async function updateEntity(entityType, id, data, group, nature) {
  if (!enableServer) return;
  
  const endpoint = ENDPOINT_MAP[entityType];
  if (!endpoint) {
    console.error(`No endpoint found for entity type: ${entityType}`);
    return;
  }
  
  try {
    await axios.patch(`${endpoint}/${id}`, data);
    mutate([CATEGORY_ENDPOINT, { params: { group } }]);
    mutate([RETURN_PATTERN_ENDPOINT, { params: { group, nature } }]);
  } catch (error) {
    console.error(`Error updating ${entityType}:`, error);
  }
}

// ----------------------------------------------------------------------
// Categories
export function useGetCategories(group) {
  const url = group ? [CATEGORY_ENDPOINT, { params: { group } }] : ''; 
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      categories: data?.data?.records || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetReturnPatterns(group, nature) {
  const url = group && nature ? [RETURN_PATTERN_ENDPOINT, { params: { group, nature } }] : '';
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      returnPatterns: data?.data?.records || [],
      returnPatternsLoading: isLoading,
      returnPatternsError: error,
      returnPatternsValidating: isValidating,
      returnPatternsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetIdentificationEntities() {
  
  const url = endpoints.settings.identification.globalSettings.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      entities: data?.data || [],
      entitiesLoading: isLoading,
      entitiesError: error,
      entitiesValidating: isValidating,
      entitiesEmpty: !isLoading && !isValidating && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}



// ----------------------------------------------------------------------
export function useGetIdentificationEntity(productId) {
  const url = productId ? [endpoints.product.details, { params: { productId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}



// ----------------------------------------------------------------------
