import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { StoreCreateView } from 'src/sections/settings/stores/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter new store | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StoreCreateView />
    </>
  );
}
