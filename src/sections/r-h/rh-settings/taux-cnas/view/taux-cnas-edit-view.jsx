import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TauxCnasNewEditForm } from '../taux-cnas-new-edit-form';

// ----------------------------------------------------------------------

export function TauxCnasEditView({ cnasRate }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.cnasRate}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Taux CNAS', href: paths.dashboard.rh.rhSettings.cnasRate },
          { name: cnasRate?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {cnasRate && <TauxCnasNewEditForm currentTaux={cnasRate} />}
    </DashboardContent>
  );
}
