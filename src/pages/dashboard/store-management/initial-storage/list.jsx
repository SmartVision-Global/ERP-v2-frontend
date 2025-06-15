import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { InitialStorageListView } from 'src/sections/store/raw-materials/initial-storage/view/initialStorage-list-view';

// import { StorageAreaListView } from 'src/sections/store/raw-materials/storage-area/view/storageArea-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Entrée de stock | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InitialStorageListView product_type={product_type} />
    </>
  );
}
