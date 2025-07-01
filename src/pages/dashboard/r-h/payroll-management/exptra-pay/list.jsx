import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ExtraListView } from 'src/sections/r-h/payroll-management/extra-pay/view';

// ----------------------------------------------------------------------

const metadata = { title: `Extra paie mois | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExtraListView />
    </>
  );
}
