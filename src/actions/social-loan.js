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

const ENDPOINT = endpoints.socialLoan;

// ----------------------------------------------------------------------

export function useGetSocialLoans(params) {
  const url = params ? [endpoints.socialLoan, { params }] : endpoints.socialLoan;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      socialLoans: data?.data?.records || [],
      socialLoansCount: data?.data?.total || 0,

      socialLoansLoading: isLoading,
      socialLoansError: error,
      socialLoansValidating: isValidating,
      socialLoansEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function getFiltredSocialLoans(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetSocialLoan(rateId) {
  // const url = productId ? [endpoints.product.details, { params: { productId } }] : '';
  const url = rateId ? [`${endpoints.socialLoan}/${rateId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      socialLoan: data?.data,
      socialLoanLoading: isLoading,
      socialLoanError: error,
      socialLoanValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createSocialLoan(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}

export async function updateSocialLoan(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  //   mutate(endpoints.site);
}

export async function validateSocialLoan(id, data, params) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/validate`, data);
  // mutate(ENDPOINT);
  mutate([ENDPOINT, { params }]);
}

export async function archiveSocialLoan(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/archive`, data);
  //   mutate(endpoints.site);
  mutate(ENDPOINT);
}

export async function cancelSocialLoan(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(`${ENDPOINT}/${id}/cancel`, data);
  //   mutate(endpoints.site);
  mutate(ENDPOINT);
}
