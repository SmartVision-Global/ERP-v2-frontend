import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { WorkshopNewEditForm } from '../workshop-new-edit-form';

// ----------------------------------------------------------------------

export function WorkshopCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Atelier"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ateliers', href: paths.dashboard.settings.workshop.root },
          { name: 'Ajouter atelier' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <WorkshopNewEditForm />
    </DashboardContent>
  );
}
