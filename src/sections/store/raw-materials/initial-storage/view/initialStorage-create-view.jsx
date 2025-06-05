import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InitialStorageNewEditForm } from '../initialStorage-new-edit-form';

// ----------------------------------------------------------------------

export function InitialStorageCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter une entrée de stock"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Entrées de stock', href: paths.dashboard.store.rawMaterials.initialStorage },
          { name: 'Ajouter une entrée de stock' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InitialStorageNewEditForm />
    </DashboardContent>
  );
}
