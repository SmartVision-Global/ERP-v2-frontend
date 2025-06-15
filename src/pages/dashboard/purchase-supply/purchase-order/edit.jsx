import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetPurchaseOrder } from 'src/actions/purchase-supply/purchase-order/order';

import { OrderEditView } from 'src/sections/purchase_supply/purchase-order/view/order-edit';
// ----------------------------------------------------------------------

const metadata = { title: `Modifier Demande D'achat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { purchaseOrder } = useGetPurchaseOrder(id);
  console.log('order', purchaseOrder);  
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderEditView purchaseOrder={purchaseOrder} />
    </>
  );
}
