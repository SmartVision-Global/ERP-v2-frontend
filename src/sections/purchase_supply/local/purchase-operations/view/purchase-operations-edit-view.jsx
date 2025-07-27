import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PurchaseOperationsNewEditForm } from '../purchase-operations-new-edit-form';

// ----------------------------------------------------------------------

export function PurchaseOperationsEditView({ purchaseOperations }) {
  const { t } = useTranslate('purchase-supply-module');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.edit_purchase_operations', { code: purchaseOperations?.code })}
        backHref={paths.dashboard.purchaseSupply.purchaseOperations.root}
        links={[
          { name: t('views.purchase_and_supply'), href: paths.dashboard.root },
          { name: t('views.purchase_operations'), href: paths.dashboard.purchaseSupply.purchaseOperations.root },
          { name: purchaseOperations?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {purchaseOperations && <PurchaseOperationsNewEditForm initialData={purchaseOperations} />}
    </DashboardContent>
  );
}
