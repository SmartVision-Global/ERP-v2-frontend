import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IntegrationNewEditForm } from '../integration-new-edit-form';

// ----------------------------------------------------------------------

export function IntegrationCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter un bon de sortie"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Bons de sortie', href: paths.dashboard.store.rawMaterials.exitSlip },
          { name: 'Ajouter un bon de sortie' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <IntegrationNewEditForm />
    </DashboardContent>
  );
}
