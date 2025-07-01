import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { StoreListView } from 'src/sections/settings/stores/view';

// ----------------------------------------------------------------------

const metadata = { title: `Store list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StoreListView />
    </>
  );
}
