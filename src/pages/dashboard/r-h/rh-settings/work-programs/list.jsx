import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { WorkProgramsListView } from 'src/sections/r-h/rh-settings/work-programs/view';

// ----------------------------------------------------------------------

const metadata = { title: `Programmes de travail list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WorkProgramsListView />
    </>
  );
}
