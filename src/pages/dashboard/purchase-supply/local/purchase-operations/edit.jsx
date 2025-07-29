import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetPurchaseOperation } from 'src/actions/purchase-supply/purchase-operations';

import { PurchaseOperationsEditView } from 'src/sections/purchase_supply/local/purchase-operations/view';
// ----------------------------------------------------------------------

const metadata = { title: `Modifier Demande D'achat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { purchaseOperation } = useGetPurchaseOperation(id);
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PurchaseOperationsEditView purchaseOperations={purchaseOperation} />
    </>
  );
}
