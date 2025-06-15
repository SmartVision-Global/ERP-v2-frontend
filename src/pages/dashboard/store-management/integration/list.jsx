import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { IntegrationListView } from 'src/sections/store/raw-materials/integration/view/integration-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Bon de réintégration | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <IntegrationListView product_type={product_type} />
    </>
  );
}
