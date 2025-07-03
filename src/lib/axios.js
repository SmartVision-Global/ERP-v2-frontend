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

  generalSettings: '/v1/settings/global-settings',
  generalSettingsDetails: '/v1/settings/global-setting-details',
  site: '/v1/settings/sites',
  workshop: '/v1/settings/workshops',
  service: '/v1/settings/services',
  store: '/v1/settings/stores',

  machine: '/v1/settings/machines',
  society: '/v1/settings/enterprises',
  function: '/v1/hr/function/jobs',
  task: 'v1/hr/function/duties_responsibilities',
  careerKnowledges: '/v1/hr/function/career_knowledges',
  personal: '/v1/hr/personal/personals',
  personalDocument: (id, type) => `/v1/hr/personal/personals/${id}/print/${type}`,

  settings: {
    identification: {
      globalSettings: {
        list: '/v1/settings/identification',
        measurementUnits: '/v1/settings/measurement-units',
        dimensions: '/v1/settings/dimensions',
        conditionings: '/v1/settings/conditionings',
        files: '/v1/settings/files',
        productFormats: '/v1/settings/product-formats',
        productConditionings: '/v1/settings/product-conditionings',
        calibers: '/v1/settings/calibers',
        typeInterfaces: '/v1/settings/type-interfaces',
        customerFiles: '/v1/settings/customer-files',
        expenses: '/v1/settings/expenses',
        expenseMeasurementUnits: '/v1/settings/expense-measurement-units',
        erpNeeds: '/v1/settings/erp-needs',
        sectors: '/v1/settings/sectors',
        services: '/v1/settings/services',
      },
      rawMaterials: {
        list: '/v1/settings/identification',
      },
      families: {
        list: '/v1/settings/families',
      },
      categories: {
        list: '/v1/settings/categories',
      },
      returnPatterns: {
        list: '/v1/settings/return-patterns',
      },
    },
    validationCircuits: '/v1/settings/validation-circuits',
  },
  // gestion magasinage
  stores: {
    // raw materials stocks : product_type=1,
    list: '/v1/inventory/products',
    operations: '/v1/inventory/product-history',
    third: '/v1/inventory/tiers',
    borrowings: '/v1/inventory/borrowings',
    nonMovingProducts: '/v1/inventory/non-moving-products',
    borrowingLookup: '/v1/inventory/lookups/borrowing',
    borrowingReturns: '/v1/inventory/borrowing-returns',
    storageArea: '/v1/inventory/storage-areas',
    initialStorage: '/v1/inventory/initial-storages',
    exitSlip: '/v1/inventory/exit-slips',
    integrations: '/v1/inventory/integration-requests',
    transferSlips: '/v1/inventory/transfer-slips',
  },
  // expression of needs
  expressionOfNeeds: {
    beb: {
      list: '/v1/expression-of-need/eon-vouchers',
      items: (id) => `/v1/expression-of-need/eon-vouchers/${id}/items`,
    },
  },
  purchaseSupply: {
    purchaseOrder: {
      list: '/v1/purchases/purchase-requests',
      items: (id) => `/v1/purchases/purchase-requests/${id}/items`,
      confirm: (id) => `/v1/purchases/purchase-requests/${id}/confirme`,
    },
  },

  // new:''
  // ecritures
  socialLoan: '/v1/hr/writings/personal_loans',
  recovery: '/v1/hr/writings/recuperations',
  overtime: '/v1/hr/writings/overtime_works',
  leaveAbesence: '/v1/hr/writings/holiday_absences',
  permanence: '/v1/hr/writings/permanencies',
  // treatment
  relocation: '/v1/hr/treatment/personal_relocations',
  decision: '/v1/hr/treatment/personal_job_changes',
  newContract: '/v1/hr/treatment/personal_contracts',
  endContract: '/v1/hr/treatment/personal_end_services',
  // payroll
  payrollMonth: '/v1/hr/payroll/preparation/payroll_months',
  extraPayrollMonth: '/v1/hr/payroll/calculation/extra_payrolls',
  extraPayrollMonthById: (id) => `/v1/hr/payroll/calculation/extra_payrolls/month/${id}`,
  validateExtraPayrolls: '/v1/hr/payroll/calculation/extra_payrolls/validation',

  payrollMonthCalculation: '/v1/hr/payroll/calculation/payrolls',
  payrollMonthCalculationDetails: (id) => `/v1/hr/payroll/calculation/${id}/payrolls/details`,

  payrollMonthPersonalAttached: (id) => `/v1/hr/payroll/preparation/month/${id}/payrolls/attached`,
  payrollMonthPersonalUnAttached: (id) =>
    `/v1/hr/payroll/preparation/month/${id}/payrolls/unattached`,
  payrollMonthDeducationsCompensations: (monthId) =>
    `/v1/hr/payroll/calculation/${monthId}/deductions_compensations`,
  payrolls: '/v1/hr/payroll/preparation/payrolls',
  calculatePayroll: (id) => `/v1/hr/payroll/calculation/payrolls/${id}/calculate`,
  validationPayroll: (id) => `/v1/hr/payroll/calculation/payrolls/${id}/validation`,
  payrollDocument: (id) => `/v1/hr/payroll/calculation/payrolls/${id}/print`,
  // para-tax-declaration

  das: '/v1/hr/parafiscal_declaration/das',
  dasDetails: '/v1/hr/parafiscal_declaration/das/details',
  dasDetailsDownload: '/v1/hr/parafiscal_declaration/das/download',
};
