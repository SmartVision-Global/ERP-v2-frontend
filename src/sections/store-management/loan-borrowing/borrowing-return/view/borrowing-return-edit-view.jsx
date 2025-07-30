import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BorrowingReturnNewEditForm } from '../borrowing-return-new-edit-form';

export function BorrowingReturnEditView({ borrowingReturn }) {
  const { t } = useTranslate('store-management-module');

  return (
    <Container maxWidth={false}>
      <CustomBreadcrumbs
        heading={t('views.edit_borrowing_return')}
        links={[
          { name: t('views.dashboard'), href: paths.dashboard.root },
          { name: t('views.loan_borrowing'), href: paths.dashboard.storeManagement.loanBorrowing.borrowingReturn },
          { name: borrowingReturn?.code },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BorrowingReturnNewEditForm currentBorrowingReturn={borrowingReturn} />
    </Container>
  );
} 