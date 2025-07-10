import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ThirdListView } from 'src/sections/store-management/loan-borrowing/third/view';

// ----------------------------------------------------------------------

const metadata = { title: `Liste des tiers | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ThirdListView />
    </>
  );
}
