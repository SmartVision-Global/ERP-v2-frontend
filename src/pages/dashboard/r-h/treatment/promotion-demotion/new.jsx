import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PromotionDemotionCreateView } from 'src/sections/r-h/treatment/promotion-demotion/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter Décision | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PromotionDemotionCreateView />
    </>
  );
}
