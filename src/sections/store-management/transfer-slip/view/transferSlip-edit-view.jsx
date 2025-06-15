import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetIntegration } from 'src/actions/integration';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TransferSlipNewEditForm } from '../transferSlip-new-edit-form';
// ----------------------------------------------------------------------

export function TransferSlipEditView({ id, product_type }) {
  const { integration, integrationLoading } = useGetIntegration(id);
  console.log('integration', integration);

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

  if (integrationLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier le bon de transfert"
        backHref={pathConfig.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Bons de transfert',
            href: paths.dashboard.storeManagement.rawMaterial.transferSlips,
          },
          { name: 'Modifier le bon de transfert' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TransferSlipNewEditForm currentIntegration={integration} isEdit />
    </DashboardContent>
  );
}
