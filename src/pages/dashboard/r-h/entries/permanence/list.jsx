import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PermanenceListView } from 'src/sections/r-h/entries/permanence/view';

// ----------------------------------------------------------------------

const metadata = { title: `Permanence | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PermanenceListView />
    </>
  );
}
