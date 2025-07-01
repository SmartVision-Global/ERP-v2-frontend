import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobNewEditForm } from '../job-new-edit-form';

// ----------------------------------------------------------------------

export function JobEditView({ fonction }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Ressources humaines', href: paths.dashboard.root },
          { name: 'Fonctions', href: paths.dashboard.rh.fonction.fonctions },
          { name: fonction?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {fonction && <JobNewEditForm currentProduct={fonction} />}
    </DashboardContent>
  );
}
