import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SupplierNewEditForm } from '../supplier-new-edit-form';

// ----------------------------------------------------------------------

export function SupplierEditView({ supplier }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.purchaseSupply.supplier.root}
        links={[
          { name: 'Achat et Approvisionnement', href: paths.dashboard.root },
          { name: 'Liste', href: paths.dashboard.purchaseSupply.supplier.root },
          { name: "Fournisseurs" },
          { name: supplier?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {supplier && <SupplierNewEditForm currentSupplier={supplier} />}
    </DashboardContent>
  );
}
