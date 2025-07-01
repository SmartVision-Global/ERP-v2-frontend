import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetLeaveAbesence } from 'src/actions/leave-absence';

import { LeaveAbsenceEditView } from 'src/sections/r-h/entries/leave-absence/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Fonction | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { leaveAbesence } = useGetLeaveAbesence(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeaveAbsenceEditView leaveAbsence={leaveAbesence} />
    </>
  );
}
