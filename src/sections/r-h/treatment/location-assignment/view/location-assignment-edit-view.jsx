import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { LocationAssignmentNewEditForm } from '../location-assignment-new-edit-form';

// ----------------------------------------------------------------------

export function LocationAssignmentEditView({ locationAssignment }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.zones}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'CE', href: paths.dashboard.rh.treatment.locationAssignment },
          { name: locationAssignment?.id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {locationAssignment && <LocationAssignmentNewEditForm currentTaux={locationAssignment} />}
    </DashboardContent>
  );
}
