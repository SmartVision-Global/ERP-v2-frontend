import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TaskNewEditForm } from '../task-new-edit-form';

// ----------------------------------------------------------------------

export function TaskCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new tache"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Tâches et responsabilités', href: paths.dashboard.rh.fonction.taskResp },
          { name: 'Ajouter' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TaskNewEditForm />
    </DashboardContent>
  );
}
