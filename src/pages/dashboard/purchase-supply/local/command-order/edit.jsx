import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetPurchaseRequest   } from 'src/actions/purchase-supply/purchase-request/purchase-request';

import { OrderEditView } from 'src/sections/purchase_supply/purchase-order/view/order-edit';
// ----------------------------------------------------------------------

const metadata = { title: `Modifier Demande D'achat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { purchaseRequest } = useGetPurchaseRequest(id);
  console.log('order', purchaseRequest);  
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderEditView purchaseRequest={purchaseRequest} />
    </>
  );
}
