import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AgenciesNewEditForm } from '../agencies-new-edit-form';

// ----------------------------------------------------------------------

export function AgenciesCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Agence"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter Agence' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AgenciesNewEditForm />
    </DashboardContent>
  );
}
