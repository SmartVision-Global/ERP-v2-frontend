import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useGetExitSlip } from 'src/actions/exitSlip';
import { DashboardContent } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExitSlipNewEditForm } from '../exitSlip-new-edit-form';

// ----------------------------------------------------------------------

export function ExitSlipEditView({ id, product_type }) {
  const { exitSlip, exitSlipLoading } = useGetExitSlip(id);

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

  if (exitSlipLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`Modifier : ${exitSlip?.code}`}
        backHref={pathConfig.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Bons de sortie', href: paths.dashboard.storeManagement.root },
          { name: exitSlip?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ExitSlipNewEditForm currentExitSlip={exitSlip} isEdit product_type={product_type} />
    </DashboardContent>
  );
}
