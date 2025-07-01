import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { BloqueListView } from 'src/sections/r-h/personal/block/view';

// ----------------------------------------------------------------------

const metadata = { title: `Bloque list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BloqueListView />
    </>
  );
}
