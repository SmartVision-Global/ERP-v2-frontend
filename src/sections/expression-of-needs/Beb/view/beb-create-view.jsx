import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BebNewEditForm } from '../beb-new-edit-form';

// ----------------------------------------------------------------------

export function BebCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Bon d'expression des besoins"
        links={[
          { name: 'Expression des besoins', href: paths.dashboard.expressionOfNeeds.beb.root },
          { name: 'Bon d\'expression des besoins', href: paths.dashboard.expressionOfNeeds.beb.root },
          { name: 'Ajouter Bon d\'expression des besoins' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <BebNewEditForm />
    </DashboardContent>
  );
}
