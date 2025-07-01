import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ServiceListView } from 'src/sections/settings/services/view';

// ----------------------------------------------------------------------

const metadata = { title: `Services | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ServiceListView />
    </>
  );
}
