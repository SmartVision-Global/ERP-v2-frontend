import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetBorrowingReturn } from 'src/actions/store-management/borrowing-return';

import { BorrowingReturnEditView } from 'src/sections/store-management/loan-borrowing/borrowing-return/view';

const metadata = { title: `Modifier un retour d'emprunt | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const { borrowingReturn } = useGetBorrowingReturn(id);

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <BorrowingReturnEditView borrowingReturn={borrowingReturn} />
    </>
  );
} 