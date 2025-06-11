import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StockNewEditForm } from '../stock-new-edit-form';

// ----------------------------------------------------------------------

export function StockEditView({ stock, product_type }) {
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
        heading={`Modifier : ${stock?.designation}`}
        backHref={pathConfig.root}
        links={[
          { name: 'Gestion magasinage', href: pathConfig.root },
          { name: breadcrumbName, href: pathConfig.root },
          { name: stock?.designation },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {stock && <StockNewEditForm currentStock={stock} product_type={product_type} />}
    </DashboardContent>
  );
}
