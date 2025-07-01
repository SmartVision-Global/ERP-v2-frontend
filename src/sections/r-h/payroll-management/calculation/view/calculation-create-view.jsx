import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CalculationNewEditForm } from '../calculation-new-edit-form';

// ----------------------------------------------------------------------

export function CalculationCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter un Mois de paie"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter un Mois de paie' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CalculationNewEditForm />
    </DashboardContent>
  );
}
