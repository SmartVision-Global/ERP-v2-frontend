import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { RenewalContractListView } from 'src/sections/r-h/treatment/renewal-contract/view';

// ----------------------------------------------------------------------

const metadata = { title: `Contrats | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RenewalContractListView />
    </>
  );
}
