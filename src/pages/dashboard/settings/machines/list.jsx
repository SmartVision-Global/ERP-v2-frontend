import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { MachineListView } from 'src/sections/settings/machines/view';

// ----------------------------------------------------------------------

const metadata = { title: `Machines | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MachineListView />
    </>
  );
}
