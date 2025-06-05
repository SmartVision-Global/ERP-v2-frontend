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

export function useGetCalculationPayrollMonths(params) {
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

export async function createPersonalPayroll(payroll_id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  const response = await axios.post(endpoints.calculatePayroll(payroll_id), data);
  return response;
  //   mutate(endpoints.site);
}

export async function validationPersonalPayroll(payroll_id, monthId, data, params) {
  /**
   * Work on server
   */
  // const data = { directionData };
  const response = await axios.post(endpoints.validationPayroll(payroll_id), data);
  mutate(endpoints.payrollMonthPersonalAttached(monthId));
  mutate([endpoints.payrollMonthPersonalAttached(monthId), { params }]);

  return response;
}
