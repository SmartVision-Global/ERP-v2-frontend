import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EndRelationshipNewEditForm } from '../end-relationship-new-edit-form';

// ----------------------------------------------------------------------

export function EndRelationshipCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Fin de relation"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter Fin de relation' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <EndRelationshipNewEditForm />
    </DashboardContent>
  );
}
