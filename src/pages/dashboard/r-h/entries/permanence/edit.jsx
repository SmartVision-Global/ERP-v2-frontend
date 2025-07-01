import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetPermanency } from 'src/actions/permanence';

import { PermanenceEditView } from 'src/sections/r-h/entries/permanence/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Fonction | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { permanency } = useGetPermanency(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PermanenceEditView permanence={permanency} />
    </>
  );
}
