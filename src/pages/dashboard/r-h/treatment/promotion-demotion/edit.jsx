import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetDecision } from 'src/actions/decision';

import { PromotionDemotionEditView } from 'src/sections/r-h/treatment/promotion-demotion/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier CE | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { decision } = useGetDecision(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PromotionDemotionEditView promotionDemotion={decision} />
    </>
  );
}
