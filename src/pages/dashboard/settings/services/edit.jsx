import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetService } from 'src/actions/service';

import { ServiceEditView } from 'src/sections/settings/services/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Service | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { service } = useGetService(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ServiceEditView service={service} />
    </>
  );
}
