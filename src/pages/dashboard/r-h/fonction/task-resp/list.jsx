import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { TaskRespListView } from 'src/sections/r-h/function/task-responsabilities/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tâches et responsabilités | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TaskRespListView />
    </>
  );
}
