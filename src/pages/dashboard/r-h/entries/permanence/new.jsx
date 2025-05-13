import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PermanenceCreateView } from 'src/sections/r-h/entries/permanence/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Permanence | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PermanenceCreateView />
    </>
  );
}
