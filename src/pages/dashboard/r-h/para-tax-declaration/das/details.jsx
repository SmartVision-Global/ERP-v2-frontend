import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { DasDetailsView } from 'src/sections/r-h/para-fiscal-declaration/das/view';

// ----------------------------------------------------------------------

const metadata = { title: `DAS Details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DasDetailsView />
    </>
  );
}
