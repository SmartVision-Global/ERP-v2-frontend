import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MonthNewEditForm } from '../month-new-edit-form';

// ----------------------------------------------------------------------

export function MonthEditView({ month }) {
  console.log(month);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Ressources humaines', href: paths.dashboard.root },
          { name: 'Préparation paie', href: paths.dashboard.rh.payrollManagement.preparation },
          { name: month?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {month && <MonthNewEditForm currentTaux={month} />}
    </DashboardContent>
  );
}
