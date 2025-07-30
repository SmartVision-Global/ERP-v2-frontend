import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetSupplier } from 'src/actions/purchase-supply/supplier';

import { SupplierEditView } from 'src/sections/purchase_supply/local/supplier/view/supplier-edit-view';
// ----------------------------------------------------------------------

const metadata = { title: `Modifier Fournisseur | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { supplier } = useGetSupplier(id);
  console.log('supplier', supplier);  
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SupplierEditView supplier={supplier} />
    </>
  );
}
