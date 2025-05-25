import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StockNewEditForm } from '../stock-new-edit-form';

// ----------------------------------------------------------------------

export function StockEditView({ stock }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Gestion magasinage', href: paths.dashboard.root },
          { name: 'Stocks', href: paths.dashboard.store.rawMaterials.root },
          { name: stock?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {stock && <StockNewEditForm currentProduct={stock} />}
    </DashboardContent>
  );
}
