import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExitSlipNewEditForm } from '../exitSlip-new-edit-form';

// ----------------------------------------------------------------------

export function ExitSlipCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter un bon de sortie"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Bons de sortie', href: paths.dashboard.storeManagement.rawMaterial.exitSlips },
          { name: 'Ajouter un bon de sortie' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExitSlipNewEditForm />
    </DashboardContent>
  );
}
