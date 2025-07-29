import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PurchaseOperationsNewEditForm } from './../purchase-operations-new-edit-form.jsx';
// ----------------------------------------------------------------------


export function PurchaseOperationsCreateView() {
  const { t } = useTranslate('purchase-supply-module');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.purchase_operation')}
        links={[
          { name: t('views.purchase_and_supply'), href: paths.dashboard.purchaseSupply.root },
          { name: t('views.purchase_operations'), href: paths.dashboard.purchaseSupply.purchaseOperations.root },
          { name: t('views.add') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PurchaseOperationsNewEditForm />
    </DashboardContent>
  );
}
