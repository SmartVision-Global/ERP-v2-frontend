import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RenewalContractNewEditForm } from '../renewal-contract-new-edit-form';

// ----------------------------------------------------------------------

export function RenewalContractEditView({ renewalContract }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.zones}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'CE', href: paths.dashboard.rh.treatment.locationAssignment },
          { name: renewalContract?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {renewalContract && <RenewalContractNewEditForm currentTaux={renewalContract} />}
    </DashboardContent>
  );
}
