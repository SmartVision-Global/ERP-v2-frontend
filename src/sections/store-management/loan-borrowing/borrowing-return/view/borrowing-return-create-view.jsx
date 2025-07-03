import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BorrowingReturnNewEditForm } from '../borrowing-return-new-edit-form';

export function BorrowingReturnCreateView() {
  const { t } = useTranslate('store-management-module');

  return (
    <Container maxWidth={false}>
      <CustomBreadcrumbs
        heading={t('views.add_borrowing_return')}
        links={[
          { name: t('views.dashboard'), href: paths.dashboard.root },
          { name: t('views.loan_borrowing'), href: paths.dashboard.storeManagement.loanBorrowing.borrowingReturn },
          { name: t('views.new_borrowing_return') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BorrowingReturnNewEditForm />
    </Container>
  );
} 