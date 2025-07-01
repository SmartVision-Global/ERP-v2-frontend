import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StoreNewEditForm } from '../store-new-edit-form';

// ----------------------------------------------------------------------

export function StoreCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Store"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Stores', href: paths.dashboard.settings.store.root },
          { name: 'Ajouter Store' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StoreNewEditForm />
    </DashboardContent>
  );
}
