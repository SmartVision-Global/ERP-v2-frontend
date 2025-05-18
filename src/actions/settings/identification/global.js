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


const swrOptions = {
  revalidateIfStale: enableServer || false,
  revalidateOnFocus: enableServer || false,
  revalidateOnReconnect: enableServer || false,
};

// ----------------------------------------------------------------------
// measurement units
export function useGetMeasurementUnits() {
  const url = endpoints.settings.identification.measurementUnits;

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

export async function createMeasurementUnit(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(MEASUREMENT_UNIT_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateMeasurementUnit(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${MEASUREMENT_UNIT_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

// ----------------------------------------------------------------------
// dimensions
export function useGetDimensions() {
  const url = endpoints.settings.identification.globalSettings.dimensions;

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

export async function createDimension(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(DIMENSION_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateDimension(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${DIMENSION_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

// ---------------------------------------------------------------------- 
// conditionings
export function useGetConditionings() {
  const url = endpoints.settings.identification.globalSettings.conditionings;

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

export async function createConditioning(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(CONDITIONING_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateConditioning(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${CONDITIONING_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }

}

// ----------------------------------------------------------------------

export function useGetIdentificationEntities() {
  const url = endpoints.identification.list;

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
// files
export function useGetFiles() {
  const url = endpoints.settings.identification.globalSettings.files;

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

export async function createFile(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(FILE_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateFile(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${FILE_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
} 

// ----------------------------------------------------------------------
// product formats
export function useGetProductFormats() {
  const url = endpoints.settings.identification.globalSettings.productFormats;

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

export async function createProductFormat(data) {
  /**
   * Work on server
   */ 
  if (enableServer) {
    await axios.post(PRODUCT_FORMAT_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateProductFormat(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${PRODUCT_FORMAT_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

// ----------------------------------------------------------------------
// product conditionings
export function useGetProductConditionings() {
  const url = endpoints.settings.identification.globalSettings.productConditionings;

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

export async function createProductConditioning(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(PRODUCT_CONDITIONING_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateProductConditioning(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${PRODUCT_CONDITIONING_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

// ----------------------------------------------------------------------
// calibers
export function useGetCalibers() {
  const url = endpoints.settings.identification.globalSettings.calibers;

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

export async function createCaliber(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(CALIBER_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateCaliber(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${CALIBER_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

// ----------------------------------------------------------------------
// type interfaces
export function useGetTypeInterfaces() {
  const url = endpoints.settings.identification.globalSettings.typeInterfaces;

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

export async function createTypeInterface(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(TYPE_INTERFACE_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateTypeInterface(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${TYPE_INTERFACE_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

// ----------------------------------------------------------------------
// customer files
export function useGetCustomerFiles() {
  const url = endpoints.settings.identification.globalSettings.customerFiles;

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

export async function createCustomerFile(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(CUSTOMER_FILE_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateCustomerFile(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${CUSTOMER_FILE_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

// ----------------------------------------------------------------------
// expenses
export function useGetExpenses() {
  const url = endpoints.settings.identification.globalSettings.expenses;

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

export async function createExpense(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(EXPENSE_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateExpense(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${EXPENSE_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

// ----------------------------------------------------------------------
// expense measurement units
export function useGetExpenseMeasurementUnits() {
  const url = endpoints.settings.identification.globalSettings.expenseMeasurementUnits;

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

export async function createExpenseMeasurementUnit(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(EXPENSE_MEASUREMENT_UNIT_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateExpenseMeasurementUnit(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${EXPENSE_MEASUREMENT_UNIT_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

// ----------------------------------------------------------------------
// erp needs
export function useGetErpNeeds() {
  const url = endpoints.settings.identification.globalSettings.erpNeeds;

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

export async function createErpNeed(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.post(ERP_NEED_ENDPOINT, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
}

export async function updateErpNeed(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.patch(`${ERP_NEED_ENDPOINT}/${id}`, data);
    mutate(endpoints.settings.identification.globalSettings.list);
  }
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
