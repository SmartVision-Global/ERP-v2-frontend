import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PurchaseRequestNewEditForm } from './../purchase-request-new-edit-form';

// ----------------------------------------------------------------------

export function PurchaseRequestCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Demande D'achats"
        links={[
          { name: 'Achat et Approvisionnement', href: paths.dashboard.purchaseSupply.purchaseRequest.root },
          
          { name: "Demande D'achats" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PurchaseRequestNewEditForm />
    </DashboardContent>
  );
}
