import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { StorageAreaListView } from 'src/sections/store-management/storage-area/view/storageArea-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Lieu de stockage | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StorageAreaListView product_type={product_type} />
    </>
  );
}
