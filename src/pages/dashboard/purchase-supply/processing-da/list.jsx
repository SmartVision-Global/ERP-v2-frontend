import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ProcessingDaList } from 'src/sections/purchase_supply/processing-da/view/processing-da-list';

// ----------------------------------------------------------------------

const metadata = { title: `Traitement des demandes d'achats | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProcessingDaList />
    </>
  );
}
