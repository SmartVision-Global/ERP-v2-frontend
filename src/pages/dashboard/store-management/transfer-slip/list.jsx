import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { TransferSlipListView } from 'src/sections/store/raw-materials/transfer-slip/view/transferSlip-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Bons de transfert | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransferSlipListView product_type={product_type} />
    </>
  );
}
