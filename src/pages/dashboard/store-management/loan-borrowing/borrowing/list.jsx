import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { BorrowingListView } from 'src/sections/store-management/loan-borrowing/borrowing/view';

// ----------------------------------------------------------------------

const metadata = { title: `Liste des prêts emprunts | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BorrowingListView />
    </>
  );
}
