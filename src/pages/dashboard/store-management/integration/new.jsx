import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { IntegrationCreateView } from 'src/sections/store-management/integration/view/integration-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter un bon de réintégration | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <IntegrationCreateView product_type={product_type} />
    </>
  );
}
