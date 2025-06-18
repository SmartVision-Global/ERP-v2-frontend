import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { OperationsListView } from 'src/sections/store-management/operations/view';

// ----------------------------------------------------------------------

const metadata = { title: `Suivi des produits | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OperationsListView product_type={product_type} />
    </>
  );
}
