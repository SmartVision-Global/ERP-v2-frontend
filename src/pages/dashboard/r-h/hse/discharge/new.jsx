import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { EndRelationshipCreateView } from 'src/sections/r-h/treatment/end-relationship/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Fin de relation | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EndRelationshipCreateView />
    </>
  );
}
