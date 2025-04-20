import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetPersonal } from 'src/actions/personal';

import { PersonalEditView } from 'src/sections/r-h/personal/actif/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Personel | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { personal } = useGetPersonal(id);
  console.log('ppppppp', personal);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PersonalEditView personal={personal} />
    </>
  );
}
