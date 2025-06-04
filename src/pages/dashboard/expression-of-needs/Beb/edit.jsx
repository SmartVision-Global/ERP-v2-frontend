import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetStock } from 'src/actions/stores/raw-materials/stocks';

import { BebEditView } from 'src/sections/expression-of-needs/Beb/view/beb-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Stock | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { beb } = useGetStock(id);
  

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BebEditView beb={beb} />
    </>
  );
}
