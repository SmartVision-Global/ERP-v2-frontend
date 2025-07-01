import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
};

const ENDPOINT = endpoints.endContract;

// ----------------------------------------------------------------------

export function useGetEndContracts(params) {
  const url = params ? [endpoints.endContract, { params }] : endpoints.endContract;

  // const url = endpoints.endContract;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      endContracts: data?.data?.records || [],
      endContractsCount: data?.data?.total || 0,

      endContractsLoading: isLoading,
      endContractsError: error,
      endContractsValidating: isValidating,
      endContractsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function getFiltredEndContracts(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetEndContract(productId) {
  const url = productId ? [`${endpoints.endContract}/${productId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      endContract: data?.data,
      endContractLoading: isLoading,
      endContractError: error,
      endContractValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createEndContract(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}

export async function updateEndContract(id, data) {
  await axios.patch(`${ENDPOINT}/${id}`, data);
  mutate(`${ENDPOINT}`);
}

export async function archiveEndContract(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.delete(`${ENDPOINT}/${id}`);
  // mutate(`${ENDPOINT}/${id}`);
}

export async function validateEndContract(id, data, params) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/validate`, data);
  // mutate(`${ENDPOINT}`);
  mutate([ENDPOINT, { params }]);
}
