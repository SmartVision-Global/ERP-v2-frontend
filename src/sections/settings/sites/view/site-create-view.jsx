import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SiteNewEditForm } from '../site-new-edit-form';

// ----------------------------------------------------------------------

export function SiteCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Site"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Sites', href: paths.dashboard.settings.site.root },
          { name: 'Ajouter Site' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SiteNewEditForm />
    </DashboardContent>
  );
}
