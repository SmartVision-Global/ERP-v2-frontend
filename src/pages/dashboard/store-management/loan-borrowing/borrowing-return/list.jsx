import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { BorrowingReturnListView } from 'src/sections/store-management/loan-borrowing/borrowing-return/view';

const metadata = { title: `Liste des retours d'emprunts | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <BorrowingReturnListView />
    </>
  );
} 