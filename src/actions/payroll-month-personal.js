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

const ENDPOINT = endpoints.payrollMonth;

// ----------------------------------------------------------------------

export function useGetPayrollMonthsPersonalAttached(id, params) {
  // const url = endpoints.function;
  const url = params
    ? [endpoints.payrollMonthPersonalAttached(id), { params }]
    : endpoints.payrollMonthPersonalAttached(id);

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      payrollMonthsAttachedPersonals: data?.data?.records || [],
      payrollMonthsAttachedPersonalsCount: data?.data?.total || 0,
      payrollMonthsAttachedPersonalsLoading: isLoading,
      payrollMonthsAttachedPersonalsError: error,
      payrollMonthsAttachedPersonalsValidating: isValidating,
      payrollMonthsAttachedPersonalsEmpty:
        !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPayrollMonthsPersonalUnAttached(id, params) {
  // const url = endpoints.function;
  const url = params
    ? [endpoints.payrollMonthPersonalUnAttached(id), { params }]
    : endpoints.payrollMonthPersonalUnAttached(id);

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      payrollMonthsUnAttachedPersonals: data?.data?.records || [],
      payrollMonthsUnAttachedPersonalsCount: data?.data?.total || 0,
      payrollMonthsUnAttachedPersonalsLoading: isLoading,
      payrollMonthsUnAttachedPersonalsError: error,
      payrollMonthsUnAttachedPersonalsValidating: isValidating,
      payrollMonthsUnAttachedPersonalsEmpty:
        !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, data?.data?.total, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createPersonalPayroll(data, monthId, params) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(endpoints.payrolls, data);
  mutate([endpoints.payrollMonthPersonalAttached(monthId), { params }]);
}

export async function deletePersonalPayroll(id, monthId, params) {
  /**
   * Work on server
   */
  // const data = { directionData };

  await axios.delete(`${endpoints.payrolls}/${id}`);

  mutate([endpoints.payrollMonthPersonalAttached(monthId), { params }]);
}

export async function getFiltredAttachedPersonals(monthId, params) {
  const response = await axios.get(`${endpoints.payrollMonthPersonalAttached(monthId)}`, {
    params,
  });
  return response;
}

export async function updatePayrollMonth(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  mutate(`${ENDPOINT}/${id}`);
}

export async function archiveJob(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.delete(`${ENDPOINT}/${id}`);
  // mutate(`${ENDPOINT}/${id}`);
}
