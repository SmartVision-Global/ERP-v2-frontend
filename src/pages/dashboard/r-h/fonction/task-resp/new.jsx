import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { TaskCreateView } from 'src/sections/r-h/function/task-responsabilities/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Tâche et responsabilité | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TaskCreateView />
    </>
  );
}
