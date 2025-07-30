import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PurchaseOperationsCreateView } from 'src/sections/purchase_supply/local/purchase-operations/view';

// ----------------------------------------------------------------------

const metadata = { title: `Opérations d'achat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>  
        <title> {metadata.title}</title>
      </Helmet>

      <PurchaseOperationsCreateView />
    </>
  );
}
