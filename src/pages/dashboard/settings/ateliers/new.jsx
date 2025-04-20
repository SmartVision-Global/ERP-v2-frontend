import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { AtelierCreateView } from 'src/sections/settings/ateliers/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new zone | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AtelierCreateView />
    </>
  );
}
