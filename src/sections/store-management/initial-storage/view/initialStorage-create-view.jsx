import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InitialStorageNewEditForm } from '../initialStorage-new-edit-form';

// ----------------------------------------------------------------------

export function InitialStorageCreateView({ product_type }) {
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
        heading="Ajouter une entrée de stock"
        backHref={pathConfig.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Entrées de stock',
            href: paths.dashboard.storeManagement.rawMaterial.initialStorage,
          },
          { name: 'Ajouter une entrée de stock' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InitialStorageNewEditForm product_type={product_type} />
    </DashboardContent>
  );
}
