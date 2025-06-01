import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { OrderPurchaseList } from 'src/sections/purchase_supply/purchase-order/view/order-list';

// ----------------------------------------------------------------------

const metadata = { title: `liste des demandes d'achat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderPurchaseList />
    </>
  );
}
