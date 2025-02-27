import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CareerListView } from 'src/sections/r-h/fonction/career-path/view';

// ----------------------------------------------------------------------

const metadata = { title: `Permanence | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CareerListView />
    </>
  );
}
