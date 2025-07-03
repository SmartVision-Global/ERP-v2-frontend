import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { ParamsListView } from 'src/sections/r-h/rh-settings/identification-parameters/view';

// ----------------------------------------------------------------------

const metadata = { title: `Parametres d'identification | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ParamsListView />
    </>
  );
}
