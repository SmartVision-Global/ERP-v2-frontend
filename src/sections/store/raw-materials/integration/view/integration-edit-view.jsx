import { paths } from 'src/routes/paths';

import { useGetExitSlip } from 'src/actions/exitSlip';
import { DashboardContent } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IntegrationNewEditForm } from '../integration-new-edit-form';
// ----------------------------------------------------------------------

export function IntegrationEditView({ id }) {
  const { exitSlip, exitSlipLoading } = useGetExitSlip(id);

  if (exitSlipLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier le bon de sortie"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Bons de sortie', href: paths.dashboard.store.rawMaterials.exitSlip },
          { name: 'Modifier le bon de sortie' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <IntegrationNewEditForm currentIntegration={exitSlip} isEdit />
    </DashboardContent>
  );
}
