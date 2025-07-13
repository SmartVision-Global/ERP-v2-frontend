import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SupplierNewEditForm } from './../supplier-new-edit-form';


// ----------------------------------------------------------------------

export function SupplierCreateView() {
  const { t } = useTranslate('purchase-supply-module');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.add_supplier')}
        links={[
          { name: t('views.purchase_and_supply'), href: paths.dashboard.purchaseSupply.root },
          { name: t('views.suppliers'), href: paths.dashboard.purchaseSupply.supplier.root },
          { name: t('views.add_supplier') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SupplierNewEditForm />
    </DashboardContent>
  );
}
