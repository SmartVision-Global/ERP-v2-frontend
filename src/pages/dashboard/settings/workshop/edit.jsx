import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetWorkshop } from 'src/actions/workshop';

import { WorkshopEditView } from 'src/sections/settings/workshops/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Atelier | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { workshop } = useGetWorkshop(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WorkshopEditView workshop={workshop} />
    </>
  );
}
