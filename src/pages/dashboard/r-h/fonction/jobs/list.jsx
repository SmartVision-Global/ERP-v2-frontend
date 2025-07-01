import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { JobListView } from 'src/sections/r-h/function/jobs/view';

// ----------------------------------------------------------------------

const metadata = { title: `Fonctions | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JobListView />
    </>
  );
}
