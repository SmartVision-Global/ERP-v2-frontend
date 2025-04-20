import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SiteListView } from 'src/sections/settings/sites/view';

// ----------------------------------------------------------------------

const metadata = { title: `Site list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SiteListView />
    </>
  );
}
