import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InitialStorageNewEditForm } from '../initialStorage-new-edit-form';

// ----------------------------------------------------------------------

export function InitialStorageCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter un lieu de stockage"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Lieux de stockage', href: paths.dashboard.store.rawMaterials.storageArea },
          { name: 'Ajouter un lieu de stockage' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InitialStorageNewEditForm />
    </DashboardContent>
  );
}
