import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EntrepriseNewEditForm } from '../entreprise-new-edit-form';

// ----------------------------------------------------------------------

export function EnterpriseEditView({ enterprise }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.settings.society}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Sociétés', href: paths.dashboard.settings.society },
          { name: enterprise?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {enterprise && <EntrepriseNewEditForm currentProduct={enterprise} />}
    </DashboardContent>
  );
}
