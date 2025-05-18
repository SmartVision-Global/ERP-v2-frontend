import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = true;
// settings - identification - global settings
const MEASUREMENT_UNIT_ENDPOINT = endpoints.settings.identification.globalSettings.measurementUnits;
const DIMENSION_ENDPOINT = endpoints.settings.identification.globalSettings.dimensions;
const CONDITIONING_ENDPOINT = endpoints.settings.identification.globalSettings.conditionings;
const FILE_ENDPOINT = endpoints.settings.identification.globalSettings.files;
const PRODUCT_FORMAT_ENDPOINT = endpoints.settings.identification.globalSettings.productFormats;
const PRODUCT_CONDITIONING_ENDPOINT = endpoints.settings.identification.globalSettings.productConditionings;
const CALIBER_ENDPOINT = endpoints.settings.identification.globalSettings.calibers;
const TYPE_INTERFACE_ENDPOINT = endpoints.settings.identification.globalSettings.typeInterfaces;
const CUSTOMER_FILE_ENDPOINT = endpoints.settings.identification.globalSettings.customerFiles;
const EXPENSE_ENDPOINT = endpoints.settings.identification.globalSettings.expenses;
const EXPENSE_MEASUREMENT_UNIT_ENDPOINT = endpoints.settings.identification.globalSettings.expenseMeasurementUnits;
const ERP_NEED_ENDPOINT = endpoints.settings.identification.globalSettings.erpNeeds;
const SECTOR_ENDPOINT = endpoints.settings.identification.globalSettings.sectors;
const SERVICE_ENDPOINT = endpoints.settings.identification.globalSettings.services;


const swrOptions = {
  revalidateIfStale: enableServer || false,
  revalidateOnFocus: enableServer || false,
  revalidateOnReconnect: enableServer || false,
};

// Generic functions for creating and updating entities
// ----------------------------------------------------------------------

// Map parameter keys to their endpoint constants
const ENDPOINT_MAP = {
  'measurement_units': MEASUREMENT_UNIT_ENDPOINT,
  'dimensions': DIMENSION_ENDPOINT,
  'conditionings': CONDITIONING_ENDPOINT,
  'files': FILE_ENDPOINT,
  'product_measurement_units': PRODUCT_FORMAT_ENDPOINT,
  'product_conditionings': PRODUCT_CONDITIONING_ENDPOINT,
  'calibers': CALIBER_ENDPOINT,
  'type_interfaces': TYPE_INTERFACE_ENDPOINT,
  'customer_files': CUSTOMER_FILE_ENDPOINT,
  'expenses': EXPENSE_ENDPOINT,
  'expense_measurements': EXPENSE_MEASUREMENT_UNIT_ENDPOINT,
  'erp_needs': ERP_NEED_ENDPOINT,
  'sectors': SECTOR_ENDPOINT,
  'services': SERVICE_ENDPOINT,
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
    mutate(endpoints.settings.identification.globalSettings.list);
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
    mutate(endpoints.settings.identification.globalSettings.list);
  } catch (error) {
    console.error(`Error updating ${entityType}:`, error);
  }
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
