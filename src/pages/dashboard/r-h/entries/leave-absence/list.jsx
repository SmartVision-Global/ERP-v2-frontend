import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { LeaveAbsenceListView } from 'src/sections/r-h/entries/leave-absence/view';

// ----------------------------------------------------------------------

const metadata = { title: `Conge - Absence | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeaveAbsenceListView />
    </>
  );
}
