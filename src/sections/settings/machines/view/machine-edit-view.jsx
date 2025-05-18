import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MachineNewEditForm } from '../machine-new-edit-form';

// ----------------------------------------------------------------------

export function MachineEditView({ machine }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.settings.machine}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Machines', href: paths.dashboard.settings.machine },
          { name: machine?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {machine && <MachineNewEditForm currentProduct={machine} />}
    </DashboardContent>
  );
}
