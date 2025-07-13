import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CommandOrderListView } from 'src/sections/purchase_supply/local/command-order/view';

// ----------------------------------------------------------------------

const metadata = { title: `liste des bon de commande | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CommandOrderListView />
    </>
  );
}
