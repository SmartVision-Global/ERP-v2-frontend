import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetDutyResponsibility } from 'src/actions/task';

import { TaskEditView } from 'src/sections/r-h/function/task-responsabilities/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier tâches et responsabilités | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { dutyResponsibility } = useGetDutyResponsibility(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TaskEditView task={dutyResponsibility} />
    </>
  );
}
