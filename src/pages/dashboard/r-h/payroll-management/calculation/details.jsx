import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CalculationDetailsView } from 'src/sections/r-h/payroll-management/calculation/view';

// ----------------------------------------------------------------------

const metadata = { title: `Details de la paie | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CalculationDetailsView />
    </>
  );
}
