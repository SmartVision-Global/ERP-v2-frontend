import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BebNewEditForm } from '../beb-new-edit-form';

// ----------------------------------------------------------------------

export function BebEditView({ beb }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.expressionOfNeeds.beb.root}
        links={[
          { name: 'Expression des besoins', href: paths.dashboard.expressionOfNeeds.beb.root },
          { name: beb?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {beb && <BebNewEditForm initialData={beb} />}
    </DashboardContent>
  );
}
