import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { WorkshopNewEditForm } from '../workshop-new-edit-form';

// ----------------------------------------------------------------------

export function WorkshopEditView({ workshop }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.settings.workshop}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ateliers', href: paths.dashboard.settings.workshop },
          { name: workshop?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {workshop && <WorkshopNewEditForm currentProduct={workshop} />}
    </DashboardContent>
  );
}
