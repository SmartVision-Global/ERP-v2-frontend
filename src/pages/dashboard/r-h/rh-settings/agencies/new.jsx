import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { AgenciesCreateView } from 'src/sections/r-h/rh-settings/agencies/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new personnel | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AgenciesCreateView />
    </>
  );
}
