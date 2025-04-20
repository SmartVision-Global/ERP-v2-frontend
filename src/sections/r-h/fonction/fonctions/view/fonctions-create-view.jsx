import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { FonctionsNewEditForm } from '../fonctions-new-edit-form';

// ----------------------------------------------------------------------

export function FonctionCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Fonction"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Fonctions', href: paths.dashboard.rh.fonction.fonctions },
          { name: 'Ajouter Fonction' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FonctionsNewEditForm />
    </DashboardContent>
  );
}
