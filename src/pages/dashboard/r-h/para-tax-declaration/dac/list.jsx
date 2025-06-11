import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { DasListView } from 'src/sections/r-h/personal/das/view';

// ----------------------------------------------------------------------

const metadata = { title: `DAS list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DasListView />
    </>
  );
}
