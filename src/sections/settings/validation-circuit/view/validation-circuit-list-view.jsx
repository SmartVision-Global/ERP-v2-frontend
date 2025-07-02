import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetValidationCircuit } from 'src/actions/settings/validation-circuit';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ParamsList } from '../params-list';

// ----------------------------------------------------------------------

export function ValidationCircuitListView() {
  const { validationCircuit } = useGetValidationCircuit('transfer_slip');
  console.log('validation circuits params list view global settings', validationCircuit);

  const notFound = !validationCircuit;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: "Circuits de validation", href: paths.dashboard.settings.validationCircuit.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <ParamsList data={validationCircuit} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
