import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TaskNewEditForm } from '../task-new-edit-form';

// ----------------------------------------------------------------------

export function TaskEditView({ task }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Tâches et responsabilités', href: paths.dashboard.rh.fonction.taskResp },
          { name: task?.label?.fr },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {task && <TaskNewEditForm currentProduct={task} />}
    </DashboardContent>
  );
}
