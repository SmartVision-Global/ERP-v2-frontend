import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { InitialStorageCreateView } from 'src/sections/store/raw-materials/initial-storage/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter une entrée de stock | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InitialStorageCreateView />
    </>
  );
}
