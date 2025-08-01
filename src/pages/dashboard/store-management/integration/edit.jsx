import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { IntegrationEditView } from 'src/sections/store-management/integration/view/integration-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier le bon de réintégration | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type, id }) {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <IntegrationEditView id={id} product_type={product_type} />
    </>
  );
}
