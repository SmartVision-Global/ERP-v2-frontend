import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { LeaveAbsenceNewEditForm } from '../leave-absence-new-edit-form';

// ----------------------------------------------------------------------

export function LeaveAbsenceEditView({ leaveAbsence }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Congés - Absences', href: paths.dashboard.rh.entries.leaveAbsence },
          { name: leaveAbsence?.personal?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {leaveAbsence && <LeaveAbsenceNewEditForm currentTaux={leaveAbsence} />}
    </DashboardContent>
  );
}
