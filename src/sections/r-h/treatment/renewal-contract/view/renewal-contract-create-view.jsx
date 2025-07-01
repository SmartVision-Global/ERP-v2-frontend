import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RenewalContractNewEditForm } from '../renewal-contract-new-edit-form';

// ----------------------------------------------------------------------

export function RenewalContractCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Contrat"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Contracts', href: paths.dashboard.rh.treatment.renewalContract },
          { name: 'Ajouter Contrat' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RenewalContractNewEditForm />
    </DashboardContent>
  );
}
