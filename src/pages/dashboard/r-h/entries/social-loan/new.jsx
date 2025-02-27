import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SocialLoanCreateView } from 'src/sections/r-h/entries/social-loan/view';

// import { PersonnelCreateView } from 'src/sections/r-h/personal/actif/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Prets social | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SocialLoanCreateView />
    </>
  );
}
