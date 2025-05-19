import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SiteNewEditForm } from '../site-new-edit-form';

// ----------------------------------------------------------------------

export function SiteEditView({ site }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.settings.site}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Sites', href: paths.dashboard.settings.site },
          { name: site?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {site && <SiteNewEditForm currentProduct={site} />}
    </DashboardContent>
  );
}
