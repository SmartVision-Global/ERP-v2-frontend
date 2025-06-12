import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetPayrollMonth } from 'src/actions/payroll-month';

import { CalculationPersonalPayrollView } from 'src/sections/r-h/payroll-management/calculation/view/calculation-personal-payroll-view';

// ----------------------------------------------------------------------

const metadata = { title: `Calcule de paie | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const { payrollMonth } = useGetPayrollMonth(id);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {payrollMonth && <CalculationPersonalPayrollView month={payrollMonth} />}
    </>
  );
}
