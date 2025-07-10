import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetBorrowing } from 'src/actions/store-management/borrowing';

import { BorrowingEditView } from 'src/sections/store-management/loan-borrowing/borrowing/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Prêt Emprunt | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { borrowing } = useGetBorrowing(id);
  

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BorrowingEditView borrowing={borrowing} />
    </>
  );
}
