import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SupplierListView } from 'src/sections/purchase_supply/local/supplier/view/supplier-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `liste des fournisseurs | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SupplierListView />
    </>
  );
}
