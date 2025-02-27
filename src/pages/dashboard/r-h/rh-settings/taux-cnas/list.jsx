import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { TauxCnasListView } from 'src/sections/r-h/rh-settings/taux-cnas/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TauxCnasListView />
    </>
  );
}
