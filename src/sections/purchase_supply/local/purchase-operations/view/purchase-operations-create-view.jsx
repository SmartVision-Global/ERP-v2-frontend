import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PurchaseOperationsNewEditForm } from './../purchase-operations-new-edit-form.jsx';

// ----------------------------------------------------------------------

export function PurchaseOperationsCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Bon de commande"
        links={[
          { name: 'Achat et Approvisionnement', href: paths.dashboard.purchaseSupply.commandOrder.root },
          { name: 'Opérations d\'achat', href: paths.dashboard.purchaseSupply.purchaseOperations.root },
          { name: "Ajouter" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PurchaseOperationsNewEditForm />
    </DashboardContent>
  );
}
