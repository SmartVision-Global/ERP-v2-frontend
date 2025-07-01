import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { OvertimeListView } from 'src/sections/r-h/entries/overtime/view';

// ----------------------------------------------------------------------

const metadata = { title: `Heures supplimentaires | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OvertimeListView />
    </>
  );
}
