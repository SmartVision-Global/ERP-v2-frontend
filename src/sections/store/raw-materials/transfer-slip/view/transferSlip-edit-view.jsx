import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetIntegration } from 'src/actions/integration';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TransferSlipNewEditForm } from '../transferSlip-new-edit-form';
// ----------------------------------------------------------------------

export function TransferSlipEditView({ id }) {
  const { integration, integrationLoading } = useGetIntegration(id);
  console.log('integration', integration);

  if (integrationLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier le bon de transfert"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Bons de transfert', href: paths.dashboard.store.rawMaterials.transferSlip },
          { name: 'Modifier le bon de transfert' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TransferSlipNewEditForm currentIntegration={integration} isEdit />
    </DashboardContent>
  );
}
