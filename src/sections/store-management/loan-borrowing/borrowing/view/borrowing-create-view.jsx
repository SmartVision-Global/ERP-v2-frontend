import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BorrowingNewEditForm } from '../borrowing-new-edit-form';

  // ----------------------------------------------------------------------

export function BorrowingCreateView() {
  const { t } = useTranslate('store-management-module');
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.add_borrowing')}
        links={[
          { name: t('views.store_management'), href: paths.dashboard.storeManagement.root },
          { name: t('views.loan_borrowing'), href: paths.dashboard.storeManagement.loanBorrowing.borrowing },
          { name: t('views.add_borrowing') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <BorrowingNewEditForm />
    </DashboardContent>
  );
}
