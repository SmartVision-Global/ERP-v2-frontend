import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ExitSlipEditView } from 'src/sections/store-management/exit-slip/view/exitSlip-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier le bon de sortie | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type, id }) {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ExitSlipEditView id={id} product_type={product_type} />
    </>
  );
}
