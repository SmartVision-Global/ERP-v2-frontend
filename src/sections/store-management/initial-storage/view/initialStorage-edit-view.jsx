import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetStorageArea } from 'src/actions/storageArea';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StorageAreaNewEditForm } from '../initialStorage-new-edit-form';

// ----------------------------------------------------------------------

export function StorageAreaEditView({ id }) {
  const { storageArea, isLoading } = useGetStorageArea(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier un lieu de stockage"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Lieux de stockage',
            href: paths.dashboard.storeManagement.rawMaterial.storageArea,
          },
          { name: 'Modifier un lieu de stockage' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StorageAreaNewEditForm currentStorageArea={storageArea} isEdit />
    </DashboardContent>
  );
}
