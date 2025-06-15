import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExitSlipNewEditForm } from '../exitSlip-new-edit-form';

// ----------------------------------------------------------------------

export function ExitSlipCreateView({ product_type }) {
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
        heading="Ajouter un bon de sortie"
        backHref={pathConfig.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Bons de sortie', href: paths.dashboard.storeManagement.root },
          { name: 'Ajouter un bon de sortie' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExitSlipNewEditForm product_type={product_type} />
    </DashboardContent>
  );
}
