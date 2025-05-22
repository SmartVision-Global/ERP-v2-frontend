import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { IdentificationProvider } from 'src/contexts/IdentificationContext';

import { ParamsListView } from 'src/sections/settings/identification-parameters/raw-materials/view';

// ----------------------------------------------------------------------

const metadata = { title: `Product list | Dashboard - ${CONFIG.appName}` };

export default function Page({ group, nature }) {
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <IdentificationProvider group={group} nature={nature}>
        <ParamsListView />
      </IdentificationProvider>
    </>
  );
}
