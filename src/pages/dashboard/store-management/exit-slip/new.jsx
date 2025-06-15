import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ExitSlipCreateView } from 'src/sections/store-management/exit-slip/view/exitSlip-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter un bon de sortie | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ExitSlipCreateView product_type={product_type} />
    </>
  );
}
