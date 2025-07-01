import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { PromotionDemotionListView } from 'src/sections/r-h/treatment/promotion-demotion/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Décision de Promotion - Rétrogradation | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PromotionDemotionListView />
    </>
  );
}
