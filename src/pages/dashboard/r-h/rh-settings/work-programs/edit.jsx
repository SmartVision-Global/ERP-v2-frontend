import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetWorkProgram } from 'src/actions/work-programs';

import { WorkProgramsEditView } from 'src/sections/r-h/rh-settings/work-programs/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Programme de travail | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { workProgram } = useGetWorkProgram(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WorkProgramsEditView workPrograms={workProgram} />
    </>
  );
}
