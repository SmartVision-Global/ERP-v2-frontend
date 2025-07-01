import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { LeaveAbsenceCreateView } from 'src/sections/r-h/entries/leave-absence/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Conge - Absence | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeaveAbsenceCreateView />
    </>
  );
}
