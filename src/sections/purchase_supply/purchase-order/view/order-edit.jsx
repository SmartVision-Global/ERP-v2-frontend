import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PurchaseOrderNewEditForm } from './order-new-edit-form';

// ----------------------------------------------------------------------

export function OrderEditView({ purchaseOrder }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.purchaseSupply.purchaseOrder.root}
        links={[
          { name: 'Achat et Approvisionnement', href: paths.dashboard.root },
          { name: 'Liste', href: paths.dashboard.purchaseSupply.purchaseOrder.root },
          { name: "Demande D'achats" },
          { name: purchaseOrder?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {purchaseOrder && <PurchaseOrderNewEditForm initialData={purchaseOrder} />}
    </DashboardContent>
  );
}
