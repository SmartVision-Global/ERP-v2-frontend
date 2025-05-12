import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { AgenciesListView } from 'src/sections/r-h/rh-settings/agencies/view';

// ----------------------------------------------------------------------

const metadata = { title: `Agencies list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AgenciesListView />
    </>
  );
}
