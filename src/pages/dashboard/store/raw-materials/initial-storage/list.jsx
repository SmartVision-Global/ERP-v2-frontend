import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { InitialStorageListView } from 'src/sections/store/raw-materials/initial-storage/view';

// import { StorageAreaListView } from 'src/sections/store/raw-materials/storage-area/view/storageArea-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Lieu de stockage | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InitialStorageListView />
    </>
  );
}
