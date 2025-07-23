import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CommandOrderCreateView } from 'src/sections/purchase_supply/local/command-order/view';

// ----------------------------------------------------------------------

const metadata = { title: `Demande D'achats | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>  
        <title> {metadata.title}</title>
      </Helmet>

      <CommandOrderCreateView />
    </>
  );
}
