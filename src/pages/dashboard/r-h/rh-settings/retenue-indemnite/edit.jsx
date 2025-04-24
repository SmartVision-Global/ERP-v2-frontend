import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetDeductionCompensation } from 'src/actions/deduction-conpensation';

import { DeductionsCompensationEditView } from 'src/sections/r-h/rh-settings/deductions-compensation/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Indemnités - Retenues | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { deductionCompensation } = useGetDeductionCompensation(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DeductionsCompensationEditView deductionsCompensation={deductionCompensation} />
    </>
  );
}
