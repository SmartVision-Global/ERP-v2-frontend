import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetIdentificationEntities } from 'src/actions/settings/identification/global';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ParamsList } from '../params-list';

// ----------------------------------------------------------------------

export function ParamsListView() {
  const { entities } = useGetIdentificationEntities();
  console.log('entities params list view global settings', entities);

  const notFound = !entities;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: "Parametrage d'identification", href: paths.dashboard.rh.rhSettings.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <ParamsList data={entities} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
