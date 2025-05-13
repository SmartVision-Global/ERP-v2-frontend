import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { RecoveryCreateView } from 'src/sections/r-h/entries/recovery/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Récupération | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RecoveryCreateView />
    </>
  );
}
