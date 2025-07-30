import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ThirdNewEditForm } from '../third-new-edit-form';

// ----------------------------------------------------------------------

export function ThirdEditView({ third }) {
  const { t } = useTranslate('store-management-module');

    

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('views.edit_third', { code: third?.code })}
        backHref={paths.dashboard.storeManagement.loanBorrowing.third}
        links={[
          { name: t('views.store_management'), href: paths.dashboard.storeManagement.root },
          { name: t('views.loan_borrowing'), href: paths.dashboard.storeManagement.loanBorrowing.root },
          { name: t('views.third'), href: paths.dashboard.storeManagement.loanBorrowing.third },
          { name: third?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {third && <ThirdNewEditForm currentThird={third} />}
    </DashboardContent>
  );
}
