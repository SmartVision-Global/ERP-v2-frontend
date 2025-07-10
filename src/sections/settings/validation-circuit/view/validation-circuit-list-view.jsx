import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetValidationCircuit } from 'src/actions/settings/validation-circuit';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ValidationCircuitList } from '../validation-circuit-list';


// ----------------------------------------------------------------------

export function ValidationCircuitListView() {
  const { validationCircuit, validationCircuitsEmpty } = useGetValidationCircuit('transfer_slip');
  const { t } = useTranslate('settings-module');

  const notFound = validationCircuitsEmpty;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.list')}
        links={[
          { name: t('views.dashboard'), href: paths.dashboard.root },
          { name: t('views.validation_circuit'), href: paths.dashboard.settings.validationCircuit.root },
          { name: t('views.list') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}
      {!notFound && <ValidationCircuitList data={validationCircuit} />}
      
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
