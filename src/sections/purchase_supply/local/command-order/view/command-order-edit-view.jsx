import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CommandOrderNewEditForm } from '../command-order-new-edit-form';

// ----------------------------------------------------------------------

export function CommandOrderEditView({ commandOrder }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.purchaseSupply.commandOrder.root}
        links={[
          { name: 'Achat et Approvisionnement', href: paths.dashboard.root },
          { name: 'Liste', href: paths.dashboard.purchaseSupply.commandOrder.root },
          { name: "Demande D'achats" },
          { name: commandOrder?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {commandOrder && <CommandOrderNewEditForm initialData={commandOrder} />}
    </DashboardContent>
  );
}
