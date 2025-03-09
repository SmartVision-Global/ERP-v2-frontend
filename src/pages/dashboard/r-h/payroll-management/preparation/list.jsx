import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PreparationListView } from 'src/sections/r-h/payroll-management/preparation/view';

// ----------------------------------------------------------------------

const metadata = { title: `Préparation paie | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PreparationListView />
    </>
  );
}
