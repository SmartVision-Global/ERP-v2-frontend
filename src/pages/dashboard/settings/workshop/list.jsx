import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { AtelierListView } from 'src/sections/settings/workshops/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ateliers | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AtelierListView />
    </>
  );
}
