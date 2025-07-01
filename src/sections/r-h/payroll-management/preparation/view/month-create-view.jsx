import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MonthNewEditForm } from '../month-new-edit-form';

// ----------------------------------------------------------------------

export function MonthCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter mois de paie"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter mois de paie' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MonthNewEditForm />
    </DashboardContent>
  );
}
