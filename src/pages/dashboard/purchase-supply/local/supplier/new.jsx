import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SupplierCreateView } from 'src/sections/purchase_supply/local/supplier/view/supplier-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Fournisseurs | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SupplierCreateView />
    </>
  );
}
