import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CommandOrderNewEditForm } from './../command-order-new-edit-form.jsx';

// ----------------------------------------------------------------------

export function CommandOrderCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Bon de commande"
        links={[
          { name: 'Achat et Approvisionnement', href: paths.dashboard.purchaseSupply.commandOrder.root },
          { name: 'Liste', href: paths.dashboard.purchaseSupply.commandOrder.root },
          { name: "Bon de commande" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CommandOrderNewEditForm />
    </DashboardContent>
  );
}
