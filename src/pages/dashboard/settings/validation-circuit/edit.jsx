import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetValidationCircuit } from 'src/actions/settings/validation-circuit';

import { ValidationCircuitEditView } from 'src/sections/settings/validation-circuit/view/validation-circuit-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier circuit de validation | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { target_action = '' } = useParams();

  const { validationCircuit } = useGetValidationCircuit(target_action);

  console.log('validationCircuit', validationCircuit);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ValidationCircuitEditView validationCircuit={validationCircuit} />
    </>
  );
}
