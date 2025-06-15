import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { InitialStorageCreateView } from 'src/sections/store-management/initial-storage/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter une entrée de stock | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InitialStorageCreateView product_type={product_type} />
    </>
  );
}
