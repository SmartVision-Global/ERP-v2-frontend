import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { StorageAreaCreateView } from 'src/sections/store-management/storage-area/view/storageArea-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter un lieu de stockage | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StorageAreaCreateView product_type={product_type} />
    </>
  );
}
