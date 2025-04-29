import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ServiceNewEditForm } from '../service-new-edit-form';

// ----------------------------------------------------------------------

export function ServiceCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter service"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Services', href: paths.dashboard.settings.service.root },
          { name: 'Ajouter service' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ServiceNewEditForm />
    </DashboardContent>
  );
}
