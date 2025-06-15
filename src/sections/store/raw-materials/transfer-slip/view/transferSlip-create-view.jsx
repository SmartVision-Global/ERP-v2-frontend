import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TransferSlipNewEditForm } from '../transferSlip-new-edit-form';

// ----------------------------------------------------------------------

export function TransferSlipCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter un bon de transfert"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Bons de transfert',
            href: paths.dashboard.storeManagement.rawMaterial.transferSlips,
          },
          { name: 'Ajouter un bon de transfert' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TransferSlipNewEditForm />
    </DashboardContent>
  );
}
