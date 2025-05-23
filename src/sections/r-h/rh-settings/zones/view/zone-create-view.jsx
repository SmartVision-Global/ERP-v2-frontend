import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ZoneNewEditForm } from '../zone-new-edit-form';

// ----------------------------------------------------------------------

export function ZoneCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Zone"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Zones', href: paths.dashboard.rh.rhSettings.zones },
          { name: 'Ajouter Zone' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ZoneNewEditForm />
    </DashboardContent>
  );
}
