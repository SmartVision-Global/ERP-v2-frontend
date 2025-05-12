import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { RateCreateView } from 'src/sections/r-h/rh-settings/rates/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Taux | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RateCreateView />
    </>
  );
}
