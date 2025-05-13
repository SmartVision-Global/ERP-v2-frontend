import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SalaryGridCreateView } from 'src/sections/r-h/rh-settings/salary-grid/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter grille de salaire | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SalaryGridCreateView />
    </>
  );
}
