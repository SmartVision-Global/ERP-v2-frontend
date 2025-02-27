import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { FonctionsListView } from 'src/sections/r-h/fonction/fonctions/view';

// ----------------------------------------------------------------------

const metadata = { title: `Fonctions | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FonctionsListView />
    </>
  );
}
