import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { SocialLoanListView } from 'src/sections/r-h/entries/social-loan/view';

// ----------------------------------------------------------------------

const metadata = { title: `Prets social | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SocialLoanListView />
    </>
  );
}
