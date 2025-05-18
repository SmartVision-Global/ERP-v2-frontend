import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ServiceNewEditForm } from '../service-new-edit-form';

// ----------------------------------------------------------------------

export function ServiceEditView({ service }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.settings.service}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Services', href: paths.dashboard.settings.service },
          { name: service?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {service && <ServiceNewEditForm currentProduct={service} />}
    </DashboardContent>
  );
}
