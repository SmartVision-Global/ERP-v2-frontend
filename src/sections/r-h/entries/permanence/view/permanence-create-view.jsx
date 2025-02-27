import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermanenceNewEditForm } from '../permanence-new-edit-form';

// ----------------------------------------------------------------------

export function PermanenceCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Permanence"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter Permanence' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PermanenceNewEditForm />
    </DashboardContent>
  );
}
