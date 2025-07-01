import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeductionsCompensationNewEditForm } from '../deductions-compensation-new-edit-form';

// ----------------------------------------------------------------------

export function DeductionsCompensationCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Indemnités - Retenues"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter Indemnités - Retenues' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DeductionsCompensationNewEditForm />
    </DashboardContent>
  );
}
