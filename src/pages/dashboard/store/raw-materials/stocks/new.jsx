import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { StockCreateView } from 'src/sections/store/raw-materials/stocks/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter stock | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockCreateView />
    </>
  );
}
