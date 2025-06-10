import { calculateIrg2022 } from './utils2';

// Constants
export const SOCIAL_SECURITY_RATE = 0.09;
const IRG_EXEMPTION_THRESHOLD = 30000;
const ABATEMENT_RATE = 0.4;
const ADDITIONAL_ABATEMENT_LOWER_BOUND = 30000;
const ADDITIONAL_ABATEMENT_UPPER_BOUND = 35000;
const ABATEMENT_MIN = 1000;
const ABATEMENT_MAX = 1500;

// Monthly tax brackets
const TAX_BRACKETS = [
  { upperLimit: 20000, rate: 0.0 },
  { upperLimit: 40000, rate: 0.23 },
  { upperLimit: 80000, rate: 0.27 },
  { upperLimit: 160000, rate: 0.3 },
  { upperLimit: 320000, rate: 0.33 },
  { upperLimit: null, rate: 0.35 },
];

const DeductionCompensationType = {
  DEDUCTION: 1,
  COMPENSATION: 2,
};

const TaxableContributor = {
  CONTRIBUTABLE_TAXABLE: 1,
  NON_CONTRIBUTABLE_TAXABLE: 2,
  NON_CONTRIBUTABLE_NON_TAXABLE: 3,
};

export function calculateIRG(salary) {
  if (salary <= IRG_EXEMPTION_THRESHOLD) {
    return 0.0;
  }

  let taxableIncome = salary;
  let monthlyTax = 0.0;
  let remainingIncome = taxableIncome;
  let lowerLimit = 0;

  // Progressive tax calculation
  for (const bracket of TAX_BRACKETS) {
    const { upperLimit, rate } = bracket;

    if (upperLimit === null || taxableIncome <= upperLimit) {
      monthlyTax += remainingIncome * rate;
      break;
    } else {
      const bracketAmount = upperLimit - lowerLimit;
      monthlyTax += bracketAmount * rate;
      remainingIncome -= bracketAmount;
      lowerLimit = upperLimit;
    }
  }

  // Apply standard abatement
  let abatement = monthlyTax * ABATEMENT_RATE;
  abatement = Math.max(ABATEMENT_MIN, Math.min(abatement, ABATEMENT_MAX));
  monthlyTax -= abatement;

  // Apply additional abatement
  if (salary > ADDITIONAL_ABATEMENT_LOWER_BOUND && salary < ADDITIONAL_ABATEMENT_UPPER_BOUND) {
    monthlyTax = monthlyTax * (137 / 51) - 27925 / 8;
  }

  return Math.max(0.0, Math.round(monthlyTax * 100) / 100);
}

// Function to perform salary calculation
export function salaryCalculation(salary, deductionCompensations) {
  let sumContributor = 0;
  let sumTaxable = 0;
  let sumNoConNoTax = 0;

  deductionCompensations.forEach((deductionCompensation) => {
    const typeValue =
      deductionCompensation.type === DeductionCompensationType.COMPENSATION ? 1 : -1;
    const amount = salary * (deductionCompensation.percent / 100);

    switch (deductionCompensation.contributory_imposable) {
      case TaxableContributor.CONTRIBUTABLE_TAXABLE:
        sumContributor += typeValue * amount;
        break;
      case TaxableContributor.NON_CONTRIBUTABLE_TAXABLE:
        sumTaxable += typeValue * amount;
        break;
      case TaxableContributor.NON_CONTRIBUTABLE_NON_TAXABLE:
        sumNoConNoTax += typeValue * amount;
        break;
      default:
        console.warn('Unknown contributoryImposable type');
    }
  });

  const salaryWithSumContributor = salary + sumContributor;
  const socialSecurityRetenue = salaryWithSumContributor * SOCIAL_SECURITY_RATE;
  const postSalaryMinSSRetunue = salaryWithSumContributor - socialSecurityRetenue;
  const salaryWithTax = postSalaryMinSSRetunue + sumTaxable;
  const taxableWages = salaryWithTax - (salaryWithTax % 10);

  const retenueIRG = calculateIrg2022(taxableWages, false);
  console.log('retenueIRG', retenueIRG);

  const netSalary = taxableWages - retenueIRG;
  const netPaySalary = netSalary + sumNoConNoTax;
  return {
    postSalary: salaryWithSumContributor?.toFixed(2),
    socialSecurityRetenue: socialSecurityRetenue?.toFixed(2),
    postSalaryMinSSRetunue: postSalaryMinSSRetunue?.toFixed(2),
    salaryWithTax: salaryWithTax?.toFixed(2),
    retenueIRG: retenueIRG?.toFixed(2),
    netSalary: netSalary?.toFixed(2),
    netPaySalary: netPaySalary?.toFixed(2),
  };
}
