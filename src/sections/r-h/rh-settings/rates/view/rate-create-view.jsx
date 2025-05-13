import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RateNewEditForm } from '../rate-new-edit-form';

// ----------------------------------------------------------------------

export function RateCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Taux CNAS"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Taux CNAS', href: paths.dashboard.rh.rhSettings.cnasRate },
          { name: 'Ajouter Taux CNAS' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RateNewEditForm />
    </DashboardContent>
  );
}
