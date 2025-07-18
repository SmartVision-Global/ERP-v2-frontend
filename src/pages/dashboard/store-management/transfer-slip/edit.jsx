import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { TransferSlipEditView } from 'src/sections/store-management/transfer-slip/view/transferSlip-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier le bon de transfert | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type, id }) {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <TransferSlipEditView id={id} product_type={product_type} />
    </>
  );
}
