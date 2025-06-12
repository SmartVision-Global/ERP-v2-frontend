import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RecoveryNewEditForm } from '../recovery-new-edit-form';

// ----------------------------------------------------------------------

const RECOVERY = {
  1: 'Permanence - jours supplémentaires',
  2: 'Heures supplémentaires',
};

export function RecoveryEditView({ recovery }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Récupération', href: paths.dashboard.rh.fonction.fonctions },
          { name: recovery?.type ? RECOVERY[recovery?.type] : '-' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {recovery && <RecoveryNewEditForm currentTaux={recovery} />}
    </DashboardContent>
  );
}
