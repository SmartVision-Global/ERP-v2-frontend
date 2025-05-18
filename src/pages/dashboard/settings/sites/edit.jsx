import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetSite } from 'src/actions/site';

import { SiteEditView } from 'src/sections/settings/sites/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Site | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { site } = useGetSite(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SiteEditView site={site} />
    </>
  );
}
