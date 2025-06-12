import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetIntegration } from 'src/actions/integration';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IntegrationNewEditForm } from '../integration-new-edit-form';
// ----------------------------------------------------------------------

export function IntegrationEditView({ id }) {
  const { integration, integrationLoading } = useGetIntegration(id);
  console.log('integration', integration);

  if (integrationLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier l'intégration"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Intégrations', href: paths.dashboard.store.rawMaterials.integration },
          { name: "Modifier l'intégration" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <IntegrationNewEditForm currentIntegration={integration} isEdit />
    </DashboardContent>
  );
}
