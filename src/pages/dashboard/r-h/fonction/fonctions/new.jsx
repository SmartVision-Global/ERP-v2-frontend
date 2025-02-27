import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { FonctionCreateView } from 'src/sections/r-h/fonction/fonctions/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Fonction | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FonctionCreateView />
    </>
  );
}
