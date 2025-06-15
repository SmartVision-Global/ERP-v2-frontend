import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StorageAreaNewEditForm } from '../storageArea-new-edit-form';

// ----------------------------------------------------------------------

export function StorageAreaCreateView({ product_type }) {
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
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter un lieu de stockage"
        backHref={pathConfig.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Lieux de stockage',
            href: paths.dashboard.storeManagement.rawMaterial.storageArea,
          },
          { name: 'Ajouter un lieu de stockage' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StorageAreaNewEditForm product_type={product_type} />
    </DashboardContent>
  );
}
