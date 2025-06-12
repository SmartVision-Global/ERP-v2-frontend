import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/global-config';

import { IntegrationEditView } from 'src/sections/store/raw-materials/integration/view/integration-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier le bon de réintégration | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <IntegrationEditView id={id} />
    </>
  );
}
