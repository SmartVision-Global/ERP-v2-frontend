import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

const ENDPOINT = endpoints.careerKnowledges;

// ----------------------------------------------------------------------

export function useGetCareerKnowledges(params) {
  // const url = endpoints.careerKnowledges;
  const url = params ? [endpoints.careerKnowledges, { params }] : endpoints.careerKnowledges;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      careerKnowledges: data?.data?.records || [],
      careerKnowledgesCount: data?.data?.total || 0,

      careerKnowledgesLoading: isLoading,
      careerKnowledgesError: error,
      careerKnowledgesValidating: isValidating,
      careerKnowledgesEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
export async function getFiltredCareerKnowledges(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetCareerKnowledge(personalId) {
  const url = personalId ? [`${endpoints.careerKnowledges}/${personalId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      careerKnowledge: data?.data,
      careerKnowledgeLoading: isLoading,
      careerKnowledgeError: error,
      careerKnowledgeValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createCareerKnowledge(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  mutate(ENDPOINT);
}

export async function updateCareerKnowledge(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  mutate(ENDPOINT);
}
