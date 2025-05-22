import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { StockListView } from 'src/sections/store/raw-materials/stocks/view';

// ----------------------------------------------------------------------

const metadata = { title: `Liste des stocks de matières premières | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockListView />
    </>
  );
}
