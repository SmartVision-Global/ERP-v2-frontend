import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    // me: '/api/auth/me',

    // signIn: '/api/auth/sign-in',
    me: '/v1/profile',
    signIn: '/v1/auth/login',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  identification: {
    list: '/v1/hr/settings/identification',
    direction: '/v1/hr/settings/identification/direction',
    subsidiary: '/v1/hr/settings/identification/subsidiary',
    division: '/v1/hr/settings/identification/division',
    bank: '/v1/hr/settings/identification/bank',
    compensationLeavePattern: '/v1/hr/settings/identification/compensation_leave_pattern',
    department: '/v1/hr/settings/identification/department',
    rung: '/v1/hr/settings/identification/rung',
    grade: '/v1/hr/settings/identification/grade',
    loanAssistancePattern: '/v1/hr/settings/identification/loan_assistance_pattern',
    nationality: '/v1/hr/settings/identification/nationality',
    ppeCategory: '/v1/hr/settings/identification/ppe_category',
    salaryCategory: '/v1/hr/settings/identification/salary_category',
    ppeComplianceStandard: '/v1/hr/settings/identification/ppe_compliance_standard',
    salaryScaleLevel: '/v1/hr/settings/identification/salary_scale_level',
    section: '/v1/hr/settings/identification/section',
    teamType: '/v1/hr/settings/identification/team_type',
  },
  zone: '/v1/hr/settings/zones',
  workPrograms: '/v1/hr/settings/work_programs',
  deductionsCompensations: '/v1/hr/settings/deductions_compensations',

  salaryGrid: '/v1/hr/settings/salary_grids',
  rates: '/v1/hr/settings/rates',
  agency: '/v1/hr/settings/agencies',

  site: '/v1/settings/sites',
  workshop: '/v1/settings/workshops',
  machine: '/v1/settings/machines',
  society: '/v1/settings/enterprises',
  function: '/v1/hr/function/jobs',
  task: 'v1/hr/function/duties_responsibilities',
  careerKnowledges: '/v1/hr/function/career_knowledges',
  personal: '/v1/hr/personal/personals',
  // new:''
  // ecritures
  socialLoan: '/v1/hr/writings/personal_loans',
  recovery: '/v1/hr/writings/recuperations',
  overtime: '/v1/hr/writings/overtime_works',
  leaveAbesence: '/v1/hr/writings/holiday_absences',
  permanence: '/v1/hr/writings/permanencies',
};
