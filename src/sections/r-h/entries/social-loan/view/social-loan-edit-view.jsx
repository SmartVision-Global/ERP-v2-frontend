import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SocialLoanNewEditForm } from '../social-loan-new-edit-form';

// ----------------------------------------------------------------------

export function SocialLoanEditView({ socialLoan }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.rh.personal.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Prêt social', href: paths.dashboard.rh.entries.socialLoan },
          { name: socialLoan?.personal?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {socialLoan && <SocialLoanNewEditForm currentTaux={socialLoan} />}
    </DashboardContent>
  );
}
