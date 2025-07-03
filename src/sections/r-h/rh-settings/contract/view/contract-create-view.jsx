import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ContractNewEditForm } from '../contract-new-edit-form';

// ----------------------------------------------------------------------

export function ContractCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Zone"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Contrats', href: paths.dashboard.rh.rhSettings.contracts },
          { name: 'Ajouter Contrat' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ContractNewEditForm />
    </DashboardContent>
  );
}
