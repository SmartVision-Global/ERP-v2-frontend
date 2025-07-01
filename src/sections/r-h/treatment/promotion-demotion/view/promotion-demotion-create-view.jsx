import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PromotionDemotionNewEditForm } from '../promotion-demotion-new-edit-form';

// ----------------------------------------------------------------------

export function PromotionDemotionCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Décision"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter Décision' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PromotionDemotionNewEditForm />
    </DashboardContent>
  );
}
