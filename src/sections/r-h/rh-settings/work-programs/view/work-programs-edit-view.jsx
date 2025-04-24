import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { WorkProgramsNewEditForm } from '../work-programs-new-edit-form';

// ----------------------------------------------------------------------

export function WorkProgramsEditView({ workPrograms }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.workPrograms}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Programmes de travail', href: paths.dashboard.rh.rhSettings.workPrograms },
          { name: workPrograms?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {workPrograms && <WorkProgramsNewEditForm currentProduct={workPrograms} />}
    </DashboardContent>
  );
}
