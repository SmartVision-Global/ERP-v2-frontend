import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetBeb } from 'src/actions/expression-of-needs/beb/beb';

import { BebEditView } from 'src/sections/expression-of-needs/Beb/view/beb-edit-view';
// ----------------------------------------------------------------------

const metadata = { title: `Modifier Bon de Besoins | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { beb } = useGetBeb(id);
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BebEditView beb={beb} />
    </>
  );
}
