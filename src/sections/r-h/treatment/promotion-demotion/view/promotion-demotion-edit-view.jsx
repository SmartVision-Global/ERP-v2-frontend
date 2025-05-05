import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PromotionDemotionNewEditForm } from '../promotion-demotion-new-edit-form';

// ----------------------------------------------------------------------

export function PromotionDemotionEditView({ promotionDemotion }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.rhSettings.zones}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'CE', href: paths.dashboard.rh.treatment.locationAssignment },
          { name: promotionDemotion?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {promotionDemotion && <PromotionDemotionNewEditForm currentTaux={promotionDemotion} />}
    </DashboardContent>
  );
}
