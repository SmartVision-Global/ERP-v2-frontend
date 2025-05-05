import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetRelocation } from 'src/actions/relocation';

import { RenewalContractEditView } from 'src/sections/r-h/treatment/renewal-contract/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier CE | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { relocation } = useGetRelocation(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RenewalContractEditView renewalContract={relocation} />
    </>
  );
}
