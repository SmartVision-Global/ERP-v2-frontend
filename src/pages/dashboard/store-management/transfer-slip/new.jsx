import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { TransferSlipCreateView } from 'src/sections/store-management/transfer-slip/view/transferSlip-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter un bon de transfert | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <TransferSlipCreateView product_type={product_type} />
    </>
  );
}
