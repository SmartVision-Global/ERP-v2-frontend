import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { EndRelationshipListView } from 'src/sections/r-h/treatment/end-relationship/view';

// ----------------------------------------------------------------------

const metadata = { title: `Fin de relation de travail | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EndRelationshipListView />
    </>
  );
}
