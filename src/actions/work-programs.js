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

const ENDPOINT = endpoints.workPrograms;

// ----------------------------------------------------------------------

export function useGetWorkPrograms() {
  const url = endpoints.workPrograms;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  const newData = data?.data?.records?.map((item) => ({
    ...item,
    days: item.days?.map((day) => ({
      ...day,
      is_work_day: day.is_work_day ? 'true' : 'false',
    })),
  }));
  const memoizedValue = useMemo(
    () => ({
      workPrograms: data?.data?.records || [],
      workProgramsLoading: isLoading,
      workProgramsError: error,
      workProgramsValidating: isValidating,
      workProgramsEmpty: !isLoading && !isValidating && !data?.data?.records.length,
    }),
    [data?.data?.records, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
export function useGetWorkProgram(workProgramId) {
  const url = workProgramId ? [`${endpoints.workPrograms}/${workProgramId}`] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  // eslint-disable-next-line no-debugger
  debugger;
  // const newData = {
  //   ...data?.data,
  //   days: data?.data?.days.map((day) =>
  //     // const [hour, minute, second] = day?.start_time?.split(':');
  //     ({
  //       ...day,
  //       is_work_day: day.is_work_day ? 'true' : 'false',
  //     })
  //   ),
  //   rotation_days: data?.data?.days.length,
  // };
  const memoizedValue = useMemo(
    () => ({
      workProgram: data?.data,
      workProgramLoading: isLoading,
      workProgramError: error,
      workProgramValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export async function createWorkProgram(data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.post(ENDPOINT, data);
  //   mutate(endpoints.site);
}

export async function updateWorkProgram(id, data) {
  /**
   * Work on server
   */
  // const data = { directionData };
  await axios.patch(`${ENDPOINT}/${id}`, data);
  // mutate(`${ENDPOINT}/${id}`);
}
