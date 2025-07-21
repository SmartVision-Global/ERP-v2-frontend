import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetCommandOrder } from 'src/actions/purchase-supply/command-order/command-order';

import { CommandOrderEditView } from 'src/sections/purchase_supply/local/command-order/view';
// ----------------------------------------------------------------------

const metadata = { title: `Modifier Demande D'achat | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { commandOrder } = useGetCommandOrder(id);
  console.log('commandOrder', commandOrder);  
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CommandOrderEditView commandOrder={commandOrder} />
    </>
  );
}
