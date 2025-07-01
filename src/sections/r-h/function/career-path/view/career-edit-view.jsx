import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CareerNewEditForm } from '../career-new-edit-form';

// ----------------------------------------------------------------------

export function CareerEditView({ career }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Ressources humaines', href: paths.dashboard.root },
          { name: 'Parcours professionnel', href: paths.dashboard.rh.fonction.careerPath },
          { name: career?.label?.fr },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {career && <CareerNewEditForm currentProduct={career} />}
    </DashboardContent>
  );
}
