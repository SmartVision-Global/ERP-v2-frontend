import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { ExitSlipEditView } from 'src/sections/store/raw-materials/exit-slip/view/exitSlip-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier le bon de sortie | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ExitSlipEditView id={id} />
    </>
  );
}
