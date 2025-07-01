import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ServiceCreateView } from 'src/sections/settings/services/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Service | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ServiceCreateView />
    </>
  );
}
