import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EndRelationshipNewEditForm } from '../end-relationship-new-edit-form';

// ----------------------------------------------------------------------

export function EndRelationshipEditView({ endRelationship }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.zones}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'CE', href: paths.dashboard.rh.treatment.locationAssignment },
          { name: endRelationship?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {endRelationship && <EndRelationshipNewEditForm currentTaux={endRelationship} />}
    </DashboardContent>
  );
}
