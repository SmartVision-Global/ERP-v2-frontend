import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetSociety } from 'src/actions/society';

import { EnterpriseEditView } from 'src/sections/settings/enterprises/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Entreprise | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { society } = useGetSociety(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EnterpriseEditView enterprise={society} />
    </>
  );
}
