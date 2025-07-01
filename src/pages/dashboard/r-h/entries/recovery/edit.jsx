import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetRecovery } from 'src/actions/recovery';

import { RecoveryEditView } from 'src/sections/r-h/entries/recovery/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Fonction | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { recovery } = useGetRecovery(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RecoveryEditView recovery={recovery} />
    </>
  );
}
