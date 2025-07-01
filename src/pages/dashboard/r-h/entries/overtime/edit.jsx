import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetOvertimeById } from 'src/actions/overtime';

import { OvertimeEditView } from 'src/sections/r-h/entries/overtime/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Fonction | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { overtime } = useGetOvertimeById(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OvertimeEditView overtime={overtime} />
    </>
  );
}
