import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function ValidationCircuitListView() {

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading='Circuit de validation'
        links={[
          { name: 'Paramètres', href: paths.dashboard.settings.root },
          { name: "Circuit de validation", href: paths.dashboard.settings.validationCircuit.root },
          { name: 'Liste' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* RENDER JSX HERE */}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
