import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ExitSlipListView } from 'src/sections/store/raw-materials/exit-slip/view/exitSlip-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Bon de sortie | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ExitSlipListView product_type={product_type} />
    </>
  );
}
