import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CareerNewEditForm } from '../career-new-edit-form';

// ----------------------------------------------------------------------

export function CareerCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Parcours professionnel"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter Parcours professionnel' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CareerNewEditForm />
    </DashboardContent>
  );
}
