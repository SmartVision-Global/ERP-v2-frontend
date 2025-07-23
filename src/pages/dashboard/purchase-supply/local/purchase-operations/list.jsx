import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PurchaseOperationsListView } from 'src/sections/purchase_supply/local/purchase-operations/view';

// ----------------------------------------------------------------------

const metadata = { title: `liste des opérations d'achats | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PurchaseOperationsListView />
    </>
  );
}
