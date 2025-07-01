import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ZoneListView } from 'src/sections/r-h/rh-settings/zones/view/zone-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Zone list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ZoneListView />
    </>
  );
}
