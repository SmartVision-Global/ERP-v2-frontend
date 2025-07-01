import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { StockListView } from 'src/sections/store-management/stocks/view';

// ----------------------------------------------------------------------

const metadata = { title: `Fiche de stock Matière première | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  console.log('product_type', product_type);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockListView product_type={product_type} />
    </>
  );
}
