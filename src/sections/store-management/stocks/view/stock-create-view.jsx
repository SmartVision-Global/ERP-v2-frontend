import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StockNewEditForm } from '../stock-new-edit-form';

// ----------------------------------------------------------------------

export function StockCreateView({ product_type }) {
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
        heading="Ajouter stock"
        links={[
          { name: 'Gestion magasinage', href: pathConfig.root },
          { name: breadcrumbName, href: pathConfig.root },
          { name: 'Ajouter stock' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StockNewEditForm product_type={product_type} />
    </DashboardContent>
  );
}
