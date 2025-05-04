import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SalaryGridNewEditForm } from '../salary-grid-new-edit-form';

// ----------------------------------------------------------------------

export function SalaryGridEditView({ salaryGrid }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.salaryGrid}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Grille de salaire', href: paths.dashboard.rh.rhSettings.salaryGrid },
          { name: salaryGrid?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {salaryGrid && <SalaryGridNewEditForm currentProduct={salaryGrid} />}
    </DashboardContent>
  );
}
