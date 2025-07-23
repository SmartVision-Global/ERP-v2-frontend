import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetPurchaseRequest } from 'src/actions/purchase-supply/purchase-request/purchase-request';

import { PurchaseRequestEditView } from 'src/sections/purchase_supply/purchase-request/view';
// ----------------------------------------------------------------------

const metadata = { title: `Modifier Demande D'achat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { purchaseRequest } = useGetPurchaseRequest(id);
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PurchaseRequestEditView purchaseRequest={purchaseRequest} />
    </>
  );
}
