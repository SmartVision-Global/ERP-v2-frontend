import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { FonctionsNewEditForm } from '../fonctions-new-edit-form';

// ----------------------------------------------------------------------

export function FonctionEditView({ fonction }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Fonctions', href: paths.dashboard.rh.fonction.fonctions },
          { name: fonction?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {fonction && <FonctionsNewEditForm currentProduct={fonction} />}
    </DashboardContent>
  );
}
