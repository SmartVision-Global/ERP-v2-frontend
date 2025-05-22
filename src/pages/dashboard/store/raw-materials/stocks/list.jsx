import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ActifListView } from 'src/sections/r-h/personal/actif/view';

// ----------------------------------------------------------------------

const metadata = { title: `Liste des personnelles | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ActifListView />
    </>
  );
}
