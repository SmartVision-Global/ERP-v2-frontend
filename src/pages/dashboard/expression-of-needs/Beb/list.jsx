import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { BebListView } from 'src/sections/expression-of-needs/Beb/view';

// ----------------------------------------------------------------------

const metadata = { title: `Bon d'expression des besoins | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BebListView />
    </>
  );
}
