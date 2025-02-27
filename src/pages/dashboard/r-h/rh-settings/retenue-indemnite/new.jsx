import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { DeductionsCompensationCreateView } from 'src/sections/r-h/rh-settings/deductions-compensation/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Indemnités - Retenues | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DeductionsCompensationCreateView />
    </>
  );
}
