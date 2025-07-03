import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ContractListView } from 'src/sections/r-h/rh-settings/contract/view';

// ----------------------------------------------------------------------

const metadata = { title: `Contract list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ContractListView />
    </>
  );
}
