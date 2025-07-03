import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { BorrowingReturnCreateView } from 'src/sections/store-management/loan-borrowing/borrowing-return/view';

const metadata = { title: `Ajouter un retour d'emprunt | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <BorrowingReturnCreateView />
    </>
  );
} 