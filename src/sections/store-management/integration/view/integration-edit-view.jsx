import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetIntegration } from 'src/actions/integration';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IntegrationNewEditForm } from '../integration-new-edit-form';
// ----------------------------------------------------------------------

export function IntegrationEditView({ id, product_type }) {
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
        heading={`Modifier : ${integration?.code}`}
        backHref={pathConfig.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Intégrations', href: paths.dashboard.storeManagement.rawMaterial.integrations },
          { name: integration?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <IntegrationNewEditForm currentIntegration={integration} isEdit product_type={product_type} />
    </DashboardContent>
  );
}
