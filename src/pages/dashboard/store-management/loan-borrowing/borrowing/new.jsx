import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { BorrowingCreateView } from 'src/sections/store-management/loan-borrowing/borrowing/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Emprunt | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BorrowingCreateView />
    </>
  );
}
