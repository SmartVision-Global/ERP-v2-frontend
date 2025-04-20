import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { MachineCreateView } from 'src/sections/settings/machines/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter machine | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MachineCreateView />
    </>
  );
}
