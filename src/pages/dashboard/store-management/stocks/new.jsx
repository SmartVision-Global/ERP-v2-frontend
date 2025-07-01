import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { StockCreateView } from 'src/sections/store-management/stocks/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter stock | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockCreateView product_type={product_type} />
    </>
  );
}
