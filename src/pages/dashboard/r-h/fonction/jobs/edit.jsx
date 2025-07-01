import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetJob } from 'src/actions/function';

import { JobEditView } from 'src/sections/r-h/function/jobs/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Fonction | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { job } = useGetJob(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JobEditView fonction={job} />
    </>
  );
}
