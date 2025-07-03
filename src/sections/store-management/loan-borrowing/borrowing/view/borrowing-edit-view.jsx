import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BorrowingNewEditForm } from '../borrowing-new-edit-form';

// ----------------------------------------------------------------------

export function BorrowingEditView({ borrowing }) {
  const { t } = useTranslate('store-management-module');

    

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.edit_borrowing', { code: borrowing?.code })}
        backHref={paths.dashboard.storeManagement.loanBorrowing.borrowing}
        links={[
          { name: t('views.store_management'), href: paths.dashboard.storeManagement.root },
          { name: t('views.loan_borrowing'), href: paths.dashboard.storeManagement.loanBorrowing.root },
          { name: t('views.borrowing'), href: paths.dashboard.storeManagement.loanBorrowing.borrowing },
          { name: borrowing?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {borrowing && <BorrowingNewEditForm currentBorrowing={borrowing} />}
    </DashboardContent>
  );
}
