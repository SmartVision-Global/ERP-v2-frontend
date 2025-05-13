import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AgenciesNewEditForm } from '../agencies-new-edit-form';

// ----------------------------------------------------------------------

export function AgenciesEditView({ agency }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.agencies}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Agences', href: paths.dashboard.rh.rhSettings.agencies },
          { name: agency?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {agency && <AgenciesNewEditForm currentTaux={agency} />}
    </DashboardContent>
  );
}
