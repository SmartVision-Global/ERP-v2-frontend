import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeductionsCompensationNewEditForm } from '../deductions-compensation-new-edit-form';

// ----------------------------------------------------------------------

export function DeductionsCompensationEditView({ deductionsCompensation }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.deductionsCompensationt}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Indemnités - Retenues',
            href: paths.dashboard.rh.rhSettings.deductionsCompensation,
          },
          { name: deductionsCompensation?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {deductionsCompensation && (
        <DeductionsCompensationNewEditForm currentProduct={deductionsCompensation} />
      )}
    </DashboardContent>
  );
}
