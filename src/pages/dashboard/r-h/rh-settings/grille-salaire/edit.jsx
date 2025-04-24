import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetSalaryGrid } from 'src/actions/salary-grid';

import { SalaryGridEditView } from 'src/sections/r-h/rh-settings/salary-grid/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Grille de salaire | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { salaryGrid } = useGetSalaryGrid(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SalaryGridEditView salaryGrid={salaryGrid} />
    </>
  );
}
