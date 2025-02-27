import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TauxCnasNewEditForm } from '../taux-cnas-new-edit-form';

// ----------------------------------------------------------------------

export function TauxCnasCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Taux CNAS"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter Taux CNAS' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TauxCnasNewEditForm />
    </DashboardContent>
  );
}
