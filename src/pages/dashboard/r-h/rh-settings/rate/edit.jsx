import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetRate } from 'src/actions/cnas-rate';

import { RateEditView } from 'src/sections/r-h/rh-settings/rates/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Taux CNAS | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { rate } = useGetRate(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RateEditView cnasRate={rate} />
    </>
  );
}
