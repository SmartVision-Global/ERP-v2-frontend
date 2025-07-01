import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { EntrepriseListView } from 'src/sections/settings/enterprises/view';

// ----------------------------------------------------------------------

const metadata = { title: `Entreprises | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EntrepriseListView />
    </>
  );
}
