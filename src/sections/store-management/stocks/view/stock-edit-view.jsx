import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StockNewEditForm } from '../stock-new-edit-form';

// ----------------------------------------------------------------------

export function StockEditView({ stock, product_type }) {
  const { t } = useTranslate('store-management-module');

  const { pathConfig, breadcrumbName } = useMemo(() => {
    if (product_type === 1) {
      return {
        pathConfig: paths.dashboard.storeManagement.rawMaterial,
        breadcrumbName: t('views.raw_materials'),
      };
    }
    // Fallback for other product types.
    return {
      pathConfig: paths.dashboard.storeManagement.rawMaterial,
      breadcrumbName: t('views.stocks'),
    };
  }, [product_type, t]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.edit_stock', { code: stock?.code })}
        backHref={pathConfig.root}
        links={[
          { name: t('views.store_management'), href: pathConfig.root },
          { name: breadcrumbName, href: pathConfig.root },
          { name: stock?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {stock && <StockNewEditForm currentStock={stock} product_type={product_type} />}
    </DashboardContent>
  );
}
