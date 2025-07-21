import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetRequestPurchase } from 'src/actions/purchase-supply/purchase-order/order';

import { OrderEditView } from 'src/sections/purchase_supply/purchase-order/view/order-edit';
// ----------------------------------------------------------------------

const metadata = { title: `Modifier Demande D'achat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { requestPurchase } = useGetRequestPurchase(id);
  console.log('order', requestPurchase);  
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderEditView requestPurchase={requestPurchase} />
    </>
  );
}
