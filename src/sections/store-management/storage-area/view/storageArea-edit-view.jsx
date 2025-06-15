import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetStorageArea } from 'src/actions/storageArea';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StorageAreaNewEditForm } from '../storageArea-new-edit-form';

// ----------------------------------------------------------------------

export function StorageAreaEditView({ product_type, id }) {
  const { storageArea, isLoading } = useGetStorageArea(id);

  const { pathConfig, breadcrumbName } = useMemo(() => {
    if (product_type === 1) {
      return {
        pathConfig: paths.dashboard.storeManagement.rawMaterial,
        breadcrumbName: 'Matières Premières',
      };
    }
    // Fallback for other product types.
    return {
      pathConfig: paths.dashboard.storeManagement.rawMaterial,
      breadcrumbName: 'Stocks',
    };
  }, [product_type]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier : Lieu de stockage"
        backHref={pathConfig.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Lieux de stockage',
            href: paths.dashboard.storeManagement.rawMaterial.storageArea,
          },
          { name: 'Modifier : Lieu de stockage' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StorageAreaNewEditForm currentStorageArea={storageArea} isEdit product_type={product_type} />
    </DashboardContent>
  );
}
