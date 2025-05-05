import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetSalaryGrid } from 'src/actions/salary-grid';

import { SalaryGridEditView } from 'src/sections/r-h/rh-settings/salary-grid/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Grille de salaire | Dashboard - ${CONFIG.appName}` };

const SOCIAL_SECURITY_RATE = 0.09;

export default function Page() {
  const { id = '' } = useParams();
  const { salaryGrid } = useGetSalaryGrid(id);
  const newSalaryGrid = {
    ...salaryGrid,
    salary: parseFloat(salaryGrid?.salary || 0),
    retenueIRG: parseFloat(salaryGrid?.retenueIRG || 0),
    salary_position: parseFloat(salaryGrid?.contributory_salary || 0),
    salary_position_retenue: parseFloat(salaryGrid?.post_salary || 0),
    s_s_retenue: parseFloat(salaryGrid?.contributory_salary || 0) * SOCIAL_SECURITY_RATE,
    salary_impos:
      parseFloat(salaryGrid?.post_salary || 0) + parseFloat(salaryGrid?.sum_taxable || 0),
    net_salary_payer: parseFloat(salaryGrid?.net_salary_payable || 0),
    salary_deductions_compensations: salaryGrid?.salary_deductions_compensations?.map((item) => ({
      ...item,
      percent: item.percentage_amount,
      contributory_imposable: '2',
    })),
  };
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SalaryGridEditView salaryGrid={newSalaryGrid} />
    </>
  );
}
