import useSWR from 'swr';
import { useMemo } from 'react';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

const ENDPOINT = endpoints.payrollMonth;

// ----------------------------------------------------------------------

export function useGetPayrollMonths(params) {
  // const url = endpoints.function;
  const url = params ? [endpoints.payrollMonth, { params }] : endpoints.payrollMonth;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      payrollMonths: data?.data?.records || [],
      payrollMonthsCount: data?.data?.total || 0,
      payrollMonthsLoading: isLoading,
      payrollMonthsError: error,
      payrollMonthsValidating: isValidating,
      payrollMonthsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCalculationPayrollMonths(params) {
  // const url = endpoints.function;
  const url = params
    ? [endpoints.payrollMonthCalculation, { params }]
    : endpoints.payrollMonthCalculation;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      payrollMonthsCalculation: data?.data?.records || [],
      payrollMonthsCalculationCount: data?.data?.total || 0,
      payrollMonthsCalculationLoading: isLoading,
      payrollMonthsCalculationError: error,
      payrollMonthsCalculationValidating: isValidating,
      payrollMonthsCalculationEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCalculationPayrollMonthsDetails(id, params) {
  // const url = endpoints.function;
  const url = params
    ? [endpoints.payrollMonthCalculationDetails(id), { params }]
    : endpoints.payrollMonthCalculationDetails(id);

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      payrollMonthsCalculationDetails: data?.data?.records || [],
      payrollMonthsCalculationDetailsCount: data?.data?.total || 0,
      payrollMonthsCalculationDetailsLoading: isLoading,
      payrollMonthsCalculationDetailsError: error,
      payrollMonthsCalculationDetailsValidating: isValidating,
      payrollMonthsCalculationDetailsEmpty:
        !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
export async function getFiltredPayrollMonths(params) {
  const response = await axios.get(`${ENDPOINT}`, {
    params,
  });
  return response;
}

export function useGetPayrollMonth(productId) {
  const url = productId ? [`${endpoints.payrollMonth}/${productId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      payrollMonth: data?.data,
      payrollMonthLoading: isLoading,
      payrollMonthError: error,
      payrollMonthValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCalculationPayrollMonthsDeducationsCompensations(id) {
  // const url = endpoints.function;
  const url = endpoints.payrollMonthDeducationsCompensations(id);

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      payrollMonthsDeducationsCompensations: data?.data?.records || [],
      payrollMonthsDeducationsCompensationsCount: data?.data?.total || 0,
      payrollMonthsDeducationsCompensationsLoading: isLoading,
      payrollMonthsDeducationsCompensationsError: error,
      payrollMonthsDeducationsCompensationsValidating: isValidating,
      payrollMonthsDeducationsCompensationsEmpty:
        !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createPayrollMonth(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}

export async function updatePayrollMonth(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  // mutate(`${ENDPOINT}/${id}`);
}

export async function archiveJob(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.delete(`${ENDPOINT}/${id}`);
  // mutate(`${ENDPOINT}/${id}`);
}
