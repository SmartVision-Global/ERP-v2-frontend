import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SalaryGridListView } from 'src/sections/r-h/rh-settings/salary-grid/view';

// ----------------------------------------------------------------------

const metadata = { title: `Grille Salaire | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SalaryGridListView />
    </>
  );
}
