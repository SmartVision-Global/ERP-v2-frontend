import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SiteCreateView } from 'src/sections/settings/sites/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter new site | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SiteCreateView />
    </>
  );
}
