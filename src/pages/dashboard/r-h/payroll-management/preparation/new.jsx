import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { MonthCreateView } from 'src/sections/r-h/payroll-management/preparation/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Mois de paie | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MonthCreateView />
    </>
  );
}
