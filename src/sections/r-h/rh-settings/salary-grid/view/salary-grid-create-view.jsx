import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SalaryGridNewEditForm } from '../salary-grid-new-edit-form';

// ----------------------------------------------------------------------

export function SalaryGridCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter grille de salaire"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Grillee de salaire', href: paths.dashboard.rh.rhSettings.salaryGrid },
          { name: 'Ajouter grille de salaire' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SalaryGridNewEditForm />
    </DashboardContent>
  );
}
