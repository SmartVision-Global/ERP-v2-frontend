import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PurchaseRequestNewEditForm } from './../purchase-request-new-edit-form';

// ----------------------------------------------------------------------

export function PurchaseRequestEditView({ purchaseRequest }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.purchaseSupply.purchaseRequest.root}
        links={[
          { name: 'Achat et Approvisionnement', href: paths.dashboard.root },
          { name: 'Liste', href: paths.dashboard.purchaseSupply.purchaseRequest.root },
          { name: "Demande D'achats" },
          { name: purchaseRequest?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {purchaseRequest && <PurchaseRequestNewEditForm initialData={purchaseRequest} />}
    </DashboardContent>
  );
}
