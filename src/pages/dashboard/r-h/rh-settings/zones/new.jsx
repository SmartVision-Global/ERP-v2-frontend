import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ZoneCreateView } from 'src/sections/r-h/rh-settings/zones/view/zone-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new zone | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ZoneCreateView />
    </>
  );
}
