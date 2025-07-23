import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetChargeTypes } from 'src/actions/purchase-supply/settings/settings';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ParamsList } from '../params-list';
// ----------------------------------------------------------------------

export function ParamsListView() {
  const { chargeTypes, chargeTypesLoading, chargeTypesEmpty } = useGetChargeTypes();
  const {t} = useTranslate('purchase-supply-module')
 
  const entities = {'charge_types': chargeTypes || []};
  

  const notFound = chargeTypesEmpty;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.list')}
        links={[
          { name: t('views.dashboard'), href: paths.dashboard.root },
          { name: t('views.purchase_and_supply'), href: paths.dashboard.purchaseSupply.settings.root },
          { name: t('views.list') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {notFound && <EmptyContent filled sx={{ py: 10 }} /> }

      {!notFound && <ParamsList data={entities} />}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
