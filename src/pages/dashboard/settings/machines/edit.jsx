import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetMachine } from 'src/actions/machine';

import { MachineEditView } from 'src/sections/settings/machines/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Machine | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { machine } = useGetMachine(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MachineEditView machine={machine} />
    </>
  );
}
