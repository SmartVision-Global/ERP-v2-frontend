import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { RateListView } from 'src/sections/r-h/rh-settings/rates/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RateListView />
    </>
  );
}
