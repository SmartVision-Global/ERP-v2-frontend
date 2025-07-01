import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { LeaveAbsenceNewEditForm } from '../leave-absence-new-edit-form';

// ----------------------------------------------------------------------

export function LeaveAbsenceCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Congé - Absence"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter Congé - Absence' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <LeaveAbsenceNewEditForm />
    </DashboardContent>
  );
}
