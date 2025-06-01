import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PurchaseOrderNewEditForm } from './order-new-edit-form';

// ----------------------------------------------------------------------

export function OrderPurchaseCreate() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Demande D'achats"
        links={[
          { name: 'Achat et Approvisionnement', href: paths.dashboard.root },
          { name: 'Liste', href: paths.dashboard.rh.personal.root },
          { name: "Demande D'achats" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PurchaseOrderNewEditForm />
    </DashboardContent>
  );
}
