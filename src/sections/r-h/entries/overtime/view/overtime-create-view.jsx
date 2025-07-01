import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OvertimeNewEditForm } from '../overtime-new-edit-form';

// ----------------------------------------------------------------------

export function OvertimeCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Heures Supplémentaires"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter Heures Supplémentaires' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <OvertimeNewEditForm />
    </DashboardContent>
  );
}
