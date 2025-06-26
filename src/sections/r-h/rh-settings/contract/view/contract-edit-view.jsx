import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetGeneralSettingsContracts } from 'src/actions/generalSettings';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ContractNewEditForm } from '../contract-new-edit-form';

// ----------------------------------------------------------------------

export function ContractEditView({ zone }) {
  const { generalSettings: contract } = useGetGeneralSettingsContracts();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.zones}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Contrats', href: paths.dashboard.rh.rhSettings.contracts },
          { name: 'Modifier contrat' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {contract && <ContractNewEditForm currentProduct={contract} />}
    </DashboardContent>
  );
}
