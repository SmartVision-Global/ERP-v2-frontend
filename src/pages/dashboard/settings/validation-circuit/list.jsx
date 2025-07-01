import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

// import { ValidationCircuitListView } from 'src/sections/settings/validation-circuit/view';

// ----------------------------------------------------------------------

const metadata = { title: `Validation circuit list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* <ValidationCircuitListView /> */}
    </>
  );
}
