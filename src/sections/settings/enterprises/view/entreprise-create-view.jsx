import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EntrepriseNewEditForm } from '../entreprise-new-edit-form';

// ----------------------------------------------------------------------

export function EntrepriseCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter entreprise"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Entreprises', href: paths.dashboard.settings.society.root },
          { name: 'Ajouter entreprise' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <EntrepriseNewEditForm />
    </DashboardContent>
  );
}
