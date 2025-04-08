import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = true;
const DIRECTION_ENDPOINT = endpoints.identification.direction;

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

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

export async function createDirection(directionData) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(DIRECTION_ENDPOINT, directionData);
  }

  /**
   * Work in local
   */

  mutate(
    DIRECTION_ENDPOINT,
    (currentData) => {
      // eslint-disable-next-line no-debugger
      debugger;
      const currentDirections = currentData?.events;

      const events = [...currentDirections, directionData];

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------
