import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetEndContract } from 'src/actions/end-contract';

import { EndRelationshipEditView } from 'src/sections/r-h/treatment/end-relationship/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier CE | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { endContract } = useGetEndContract(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EndRelationshipEditView endRelationship={endContract} />
    </>
  );
}
