import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetAgency } from 'src/actions/agency';

import { AgenciesEditView } from 'src/sections/r-h/rh-settings/agencies/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Agence | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { agency } = useGetAgency(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AgenciesEditView agency={agency} />
    </>
  );
}
