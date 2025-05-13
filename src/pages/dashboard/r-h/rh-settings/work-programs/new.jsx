import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { WorkProgramsCreateView } from 'src/sections/r-h/rh-settings/work-programs/view/work-programs-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new personnel | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WorkProgramsCreateView />
    </>
  );
}
