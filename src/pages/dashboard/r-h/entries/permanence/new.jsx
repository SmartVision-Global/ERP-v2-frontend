import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CareerCreateView } from 'src/sections/r-h/fonction/career-path/view';

// import { PersonnelCreateView } from 'src/sections/r-h/personal/actif/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Permanence | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CareerCreateView />
    </>
  );
}
