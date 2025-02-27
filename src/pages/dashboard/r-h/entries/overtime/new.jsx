import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { OvertimeCreateView } from 'src/sections/r-h/entries/overtime/view';

// import { PersonnelCreateView } from 'src/sections/r-h/personal/actif/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Heures supplimentaires | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OvertimeCreateView />
    </>
  );
}
