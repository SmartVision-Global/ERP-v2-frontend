import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermanenceNewEditForm } from '../permanence-new-edit-form';

// ----------------------------------------------------------------------

export function PermanenceEditView({ permanence }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'permanence', href: paths.dashboard.rh.entries.permanence },
          { name: permanence?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {permanence && <PermanenceNewEditForm currentTaux={permanence} />}
    </DashboardContent>
  );
}
