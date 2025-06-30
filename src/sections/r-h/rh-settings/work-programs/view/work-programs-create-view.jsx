import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { WorkProgramsNewEditForm } from '../work-programs-new-edit-form';

// ----------------------------------------------------------------------

export function WorkProgramsCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Programme"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Programmes de travail', href: paths.dashboard.rh.rhSettings.workPrograms },
          { name: 'Ajouter Programme' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <WorkProgramsNewEditForm />
    </DashboardContent>
  );
}
