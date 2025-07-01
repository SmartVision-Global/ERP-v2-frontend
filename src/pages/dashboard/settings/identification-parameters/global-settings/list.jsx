import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ParamsListView } from 'src/sections/settings/identification-parameters/global-settings/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ParamsListView />
    </>
  );
}
