import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SocialLoanNewEditForm } from '../social-loan-new-edit-form';

// ----------------------------------------------------------------------

export function SocialLoanCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter prêt social"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressource humain', href: paths.dashboard.rh.personal },
          { name: 'Ajouter prêt social' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SocialLoanNewEditForm />
    </DashboardContent>
  );
}
