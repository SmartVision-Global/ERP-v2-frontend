import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StockNewEditForm } from '../stock-new-edit-form';

// ----------------------------------------------------------------------

export function StockCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter stock"
        links={[
          { name: 'Gestion magasinage', href: paths.dashboard.store.rawMaterials.root },
          { name: 'Stocks', href: paths.dashboard.store.rawMaterials.root },
          { name: 'Ajouter stock' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StockNewEditForm />
    </DashboardContent>
  );
}
