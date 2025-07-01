import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ZoneNewEditForm } from '../zone-new-edit-form';

// ----------------------------------------------------------------------

export function ZoneEditView({ zone }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.zones}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Zones', href: paths.dashboard.rh.rhSettings.zones },
          { name: zone?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {zone && <ZoneNewEditForm currentProduct={zone} />}
    </DashboardContent>
  );
}
