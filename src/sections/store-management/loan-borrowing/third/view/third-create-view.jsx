import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ThirdNewEditForm } from '../third-new-edit-form';

  // ----------------------------------------------------------------------

export function ThirdCreateView() {
  const { t } = useTranslate('store-management-module');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.add_third')}
        links={[
          { name: t('views.store_management'), href: paths.dashboard.storeManagement.root },
          { name: t('views.loan_borrowing'), href: paths.dashboard.storeManagement.loanBorrowing.third },
          { name: t('views.add_third') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ThirdNewEditForm />
    </DashboardContent>
  );
}
