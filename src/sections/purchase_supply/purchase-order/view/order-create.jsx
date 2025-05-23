import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PurchaseOrderNewEditForm } from './order-new-edit-form';

// ----------------------------------------------------------------------

export function OrderPurchaseCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter personnel"
        links={[
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Personnels', href: paths.dashboard.rh.personal.root },
          { name: 'Ajouter personnel' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PurchaseOrderNewEditForm />
    </DashboardContent>
  );
}
