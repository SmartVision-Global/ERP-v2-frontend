import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
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
          { name: personal?.first_name?.fr },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {!personal && <LoadingScreen />}
      {personal && <ActifNewEditForm currentProduct={personal} />}
    </DashboardContent>
  );
}
