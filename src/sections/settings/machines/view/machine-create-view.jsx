import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MachineNewEditForm } from '../machine-new-edit-form';

// ----------------------------------------------------------------------

export function MachineCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter machine"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Machines', href: paths.dashboard.settings.machine.root },
          { name: 'Ajouter machine' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <MachineNewEditForm />
    </DashboardContent>
  );
}
