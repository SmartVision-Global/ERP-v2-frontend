import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { LocationAssignmentNewEditForm } from '../location-assignment-new-edit-form';

// ----------------------------------------------------------------------

export function LocationAssignmentCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter CE - Mission"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter CE - Mission' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <LocationAssignmentNewEditForm />
    </DashboardContent>
  );
}
