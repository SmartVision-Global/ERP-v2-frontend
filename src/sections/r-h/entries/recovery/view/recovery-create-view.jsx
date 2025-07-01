import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RecoveryNewEditForm } from '../recovery-new-edit-form';

// ----------------------------------------------------------------------

export function RecoveryCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Récupération"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter Récupération' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RecoveryNewEditForm />
    </DashboardContent>
  );
}
