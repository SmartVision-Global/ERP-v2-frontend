import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CommandOrderNewEditForm } from '../command-order-new-edit-form';

// ----------------------------------------------------------------------

export function CommandOrderEditView({ commandOrder }) {
  const { t } = useTranslate('purchase-supply-module');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.edit_command_order', { code: commandOrder?.code })}
        backHref={paths.dashboard.purchaseSupply.commandOrder.root}
        links={[
          { name: t('views.purchase_and_supply'), href: paths.dashboard.root },
          { name: t('views.command_order'), href: paths.dashboard.purchaseSupply.commandOrder.root },
          { name: commandOrder?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {commandOrder && <CommandOrderNewEditForm initialData={commandOrder} />}
    </DashboardContent>
  );
}
