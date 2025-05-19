import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ActifNewEditForm } from '../actif-new-edit-form';

// ----------------------------------------------------------------------

export function PersonalEditView({ personal }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Personnels', href: paths.dashboard.rh.personal },
          { name: personal?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {personal && <ActifNewEditForm currentProduct={personal} />}
    </DashboardContent>
  );
}
