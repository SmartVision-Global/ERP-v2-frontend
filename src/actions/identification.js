import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// import { fetcher, endpoints } from 'src/lib/axios';
import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = true;
const DIRECTION_ENDPOINT = endpoints.identification.direction;
const SUBSIDIARY_ENDPOINT = endpoints.identification.subsidiary;
const BANK_ENDPOINT = endpoints.identification.bank;
const COMPENSATION_ENDPOINT = endpoints.identification.compensationLeavePattern;
const DEPARTMENT_ENDPOINT = endpoints.identification.department;
const DIVISION_ENDPOINT = endpoints.identification.division;
const RUNG_ENDPOINT = endpoints.identification.rung;
const GRADE_ENDPOINT = endpoints.identification.grade;
const LOAN_ASSISTANCE_ENDPOINT = endpoints.identification.loanAssistancePattern;
const NATIONALITY_ENDPOINT = endpoints.identification.nationality;
const PPE_CATEGORY_ENDPOINT = endpoints.identification.ppeCategory;
const SALARY_CATEGORY_ENDPOINT = endpoints.identification.salaryCategory;
const PPE_COMPLIANCE_ENDPOINT = endpoints.identification.ppeComplianceStandard;
const SALARY_SCALE_ENDPOINT = endpoints.identification.salaryScaleLevel;
const SECTION_ENDPOINT = endpoints.identification.section;
const TEAM_TYPE_ENDPOINT = endpoints.identification.teamType;

const swrOptions = {
  revalidateIfStale: enableServer || false,
  revalidateOnFocus: enableServer || false,
  revalidateOnReconnect: enableServer || false,
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
    mutate(endpoints.identification.list);
  }
}

export async function updateDirection(id, directionData) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${DIRECTION_ENDPOINT}/${id}`, directionData);
    mutate(endpoints.identification.list);
  }
}

export async function createSubsidiary(subsidiaryData) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(SUBSIDIARY_ENDPOINT, subsidiaryData);
    mutate(endpoints.identification.list);
  }
}

export async function updateSubsidiary(id, subsidiaryData) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${SUBSIDIARY_ENDPOINT}/${id}`, subsidiaryData);
    mutate(endpoints.identification.list);
  }
}

export async function createDivision(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(DIVISION_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateDivision(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${DIVISION_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createBank(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(BANK_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateBank(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${BANK_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createCompensationLeavePattern(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(COMPENSATION_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateCompensationLeavePattern(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${COMPENSATION_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createDepartment(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(DEPARTMENT_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateDepartment(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${DEPARTMENT_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createRung(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(RUNG_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateRung(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${RUNG_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createGrade(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(GRADE_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateGrade(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${GRADE_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createLoanAssistancePattern(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(LOAN_ASSISTANCE_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateLoanAssistancePattern(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${LOAN_ASSISTANCE_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createNationality(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(NATIONALITY_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateNationality(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${NATIONALITY_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createPpeCategory(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(PPE_CATEGORY_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updatePpeCategory(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${PPE_CATEGORY_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createSalaryCategory(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(SALARY_CATEGORY_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateSalaryCategory(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${SALARY_CATEGORY_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createPpeComplianceStandard(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(PPE_COMPLIANCE_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updatePpeComplianceStandard(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${PPE_COMPLIANCE_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createSalaryScaleLevel(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(SALARY_SCALE_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateSalaryScaleLevel(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${SALARY_SCALE_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createSection(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(SECTION_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateSection(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${SECTION_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

export async function createTeamType(data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.post(TEAM_TYPE_ENDPOINT, data);
    mutate(endpoints.identification.list);
  }
}

export async function updateTeamType(id, data) {
  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { directionData };
    await axios.patch(`${TEAM_TYPE_ENDPOINT}/${id}`, data);
    mutate(endpoints.identification.list);
  }
}

// ----------------------------------------------------------------------
