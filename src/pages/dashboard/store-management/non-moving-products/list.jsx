import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { NonMovingProductsListView } from 'src/sections/store-management/non-moving-products/non-moving-products-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Liste des produits non mouvementés | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NonMovingProductsListView product_type={product_type} />
    </>
  );
}
