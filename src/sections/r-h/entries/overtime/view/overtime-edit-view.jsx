import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OvertimeNewEditForm } from '../overtime-new-edit-form';

// ----------------------------------------------------------------------

export function OvertimeEditView({ overtime }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Fonctions', href: paths.dashboard.rh.fonction.fonctions },
          { name: overtime?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {overtime && <OvertimeNewEditForm currentTaux={overtime} />}
    </DashboardContent>
  );
}
