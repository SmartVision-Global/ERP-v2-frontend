import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetZone } from 'src/actions/zone';

import { ContractEditView } from 'src/sections/r-h/rh-settings/contract/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Contract | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { zone } = useGetZone(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ContractEditView zone={zone} />
    </>
  );
}
