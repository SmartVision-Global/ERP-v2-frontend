import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CreatePurchaseOrder } from 'src/sections/purchase_supply/purchase-order/view/order-create';

// ----------------------------------------------------------------------

const metadata = { title: `Demande D'achats | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CreatePurchaseOrder />
    </>
  );
}
